'use client';

import useMapStore from '@/store/map';

export default function DashboardTable() {
  const { distances } = useMapStore();

  if (distances.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Activity Dashboard</h3>
        <div className="text-center">
          <p className="text-gray-500">No distance calculations recorded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-medium text-gray-900">Activity Dashboard</h3>

      <div className="overflow-hidden rounded-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {distances.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{record.date}</td>
                <td className="px-6 py-4 text-sm text-gray-900">Distance Calculation</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-md">
                    <div className="truncate" title={`${record.origin} → ${record.destination}`}>
                      {record.origin} → {record.destination}
                    </div>
                    <div className="text-xs text-gray-500">
                      {record.km} km • {record.minutes} min
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
