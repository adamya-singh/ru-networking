import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from "@/components/providers";
import { NavigationButtons } from "@/components/navigation-buttons";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rutgers Course Planner',
  description: 'Plan your academic journey at Rutgers University',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <NavigationButtons />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}