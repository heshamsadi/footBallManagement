'use client';

import useMapStore from '@/store/map';

export default function DashboardTable() {
  const { distances } = useMapStore();

  if (distances.length === 0) {
    return (
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Distance Records</h3>
        <div className="rounded-md border border-gray-200 bg-white p-6 text-center">
          <p className="text-gray-500">No distance calculations yet</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Distance Records</h3>

      <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Origin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Destination
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Distance (km)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Duration (min)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {distances.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{record.date}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs truncate" title={record.origin}>
                    {record.origin}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs truncate" title={record.destination}>
                    {record.destination}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{record.km}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {record.minutes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
