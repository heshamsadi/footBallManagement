import MapWrapperUser from '@/components/MapWrapperUser';
import LayerChecklist from '@/features/frontoffice/components/LayerChecklist';
import DashboardTable from '@/features/frontoffice/components/DashboardTable';

export default function FrontOffice() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="mb-4 text-3xl font-bold">Front-office Map</h1>

      <div className="mb-4 flex flex-col gap-4 lg:flex-row">
        <LayerChecklist />
      </div>

      <div className="mb-8 h-96 rounded-xl bg-white p-4 shadow">
        <MapWrapperUser />
      </div>

      <DashboardTable />
    </div>
  );
}
