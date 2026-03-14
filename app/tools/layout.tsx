import { AuthProvider } from '@/components/AuthProvider';
import { Navbar } from '@/components/Navbar';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4">{children}</main>
      </div>
    </AuthProvider>
  );
}
