import DashboardLayout from '@/layouts/DashboardLayout';
import DataTable from '@/components/DataTable';
import MapWrapperAdmin from '@/components/MapWrapperAdmin';
import PlaceFilterTabs from '@/features/backoffice/components/PlaceFilterTabs';
import PlaceSearchBar from '@/features/backoffice/components/PlaceSearchBar';

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
            {/* Place Filter Tabs at Bottom of Map */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <PlaceFilterTabs />
            </div>
          </div>
        </div>
      </div>

      {/* Place Search Bar */}
      <div className="mb-6">
        <PlaceSearchBar />
      </div>

      {/* Data Table */}
      <DataTable />
    </DashboardLayout>
  );
}
