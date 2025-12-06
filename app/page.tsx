import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { BuildDashboard } from '@/components/BuildDashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-ocean-950 text-white font-source">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <BuildDashboard />
        </main>
      </div>
    </div>
  );
}
