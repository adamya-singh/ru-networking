import { NextRequest } from 'next/server';
import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";

// Type assertion for OpenAI beta features
interface OpenAIBeta {
  vectorStores: {
    create: (params: { name: string }) => Promise<{ id: string }>;
    files: {
      create: (vectorStoreId: string, params: { file_id: string }) => Promise<any>;
      list: (vectorStoreId: string) => Promise<{ data: { id: string }[] }>;
      retrieve: (vectorStoreId: string, fileId: string) => Promise<{ status: string }>;
      del: (vectorStoreId: string, fileId: string) => Promise<any>;
    };
  };
}

const beta = openai.beta as unknown as OpenAIBeta;

// upload file to assistant's vector store
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");
  
  if (!file) {
    return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
  }

  const vectorStoreId = await getOrCreateVectorStore();

  // upload using the file stream
  const openaiFile = await openai.files.create({
    file: file as File,
    purpose: "assistants",
  });

  // add file to vector store
  await beta.vectorStores.files.create(vectorStoreId, {
    file_id: openaiFile.id,
  });
  return new Response();
}

// list files in assistant's vector store
export async function GET() {
  const vectorStoreId = await getOrCreateVectorStore();
  const fileList = await beta.vectorStores.files.list(vectorStoreId);

  const filesArray = await Promise.all(
    fileList.data.map(async (file: { id: string }) => {
      const fileDetails = await openai.files.retrieve(file.id);
      const vectorFileDetails = await beta.vectorStores.files.retrieve(
        vectorStoreId,
        file.id
      );
      return {
        file_id: file.id,
        filename: fileDetails.filename,
        status: vectorFileDetails.status,
      };
    })
  );
  return Response.json(filesArray);
}

// delete file from assistant's vector store
export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const fileId = body.fileId;

  if (!fileId) {
    return new Response(JSON.stringify({ error: "No fileId provided" }), { status: 400 });
  }

  const vectorStoreId = await getOrCreateVectorStore();
  await beta.vectorStores.files.del(vectorStoreId, fileId);

  return new Response();
}

/* Helper functions */

const getOrCreateVectorStore = async () => {
  const assistant = await openai.beta.assistants.retrieve(assistantId);

  // if the assistant already has a vector store, return it
  if (assistant.tool_resources?.file_search?.vector_store_ids?.length) {
    return assistant.tool_resources.file_search.vector_store_ids[0];
  }

  // otherwise, create a new vector store and attach it to the assistant
  const vectorStore = await beta.vectorStores.create({
    name: "sample-assistant-vector-store",
  });

  await openai.beta.assistants.update(assistantId, {
    tool_resources: {
      file_search: {
        vector_store_ids: [vectorStore.id],
      },
    },
  });

  return vectorStore.id;
};
