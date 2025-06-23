import DashboardLayout from '@/layouts/DashboardLayout';
import WorkspaceTabs from '@/components/WorkspaceTabs';
import DataTable from '@/components/DataTable';
import MapWrapperAdmin from '@/components/MapWrapperAdmin';
import PlacesLayerCheckboxes from '@/features/backoffice/components/PlacesLayerCheckboxes';

export default function Home() {
  return (
    <DashboardLayout>
      {/* Map Section */}
      <div className="bg-white shadow rounded-lg mb-6 relative">
        <div className="px-4 py-5 sm:p-6">
          <div className="relative">
            <div className="h-[600px] w-full rounded-lg overflow-hidden">
              <MapWrapperAdmin />
            </div>
            {/* Places Layer Controls - Top Right */}
            <div className="absolute top-4 right-4 z-10">
              <PlacesLayerCheckboxes />
            </div>
            {/* Workspace Tabs at Bottom of Map */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <WorkspaceTabs />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable />
    </DashboardLayout>
  );
}
