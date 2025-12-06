import { Sidebar } from '@/components/Sidebar';
import { BuildDashboard } from '@/components/BuildDashboard';
import { PartBrowserModal } from '@/components/PartBrowserModal';

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <BuildDashboard />
      </div>
      <PartBrowserModal />
    </div>
  );
}
