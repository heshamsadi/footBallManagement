export default function DataTable() {
  const data = [
    { id: 'Pv142', date: '12/02/2025', client: 'Casablanca', name: 'Marruecos', status: 'Inactive', type: 'quotation' },
    { id: 'Pv142', date: '12/02/2025', client: 'Casablanca', name: 'Marruecos', status: 'Active', type: 'confirmed' },
    { id: 'Pv142', date: '12/02/2025', client: 'Casablanca', name: 'Marruecos', status: 'Draft', type: 'draft' },
    { id: 'Pv142', date: '12/02/2025', client: 'Casablanca', name: 'Marruecos', status: 'Draft', type: 'draft' },
    { id: 'Pv142', date: '12/02/2025', client: 'Casablanca', name: 'Marruecos', status: 'Inactive', type: 'quotation' },
    { id: 'Pv142', date: '12/02/2025', client: 'Casablanca', name: 'Marruecos', status: 'Active', type: 'confirmed' },
    { id: 'Pv125', date: '12/02/2025', client: 'Casablanca', name: 'Marruecos', status: 'Active', type: 'confirmed' },
  ];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-600 text-white';
      case 'Inactive':
        return 'bg-red-500 text-white';
      case 'Draft':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'confirmed':
        return '✓';
      case 'quotation':
        return '💬';
      case 'draft':
        return '📄';
      default:
        return '•';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Elementos</h3>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Filter Projects
            </button>
            <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Advanced Search
            </button>
          </div>
        </div>        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                  Service Id
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                  Date Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                  View
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                  Favorites
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.map((item, index) => (
                <tr key={index} className={`hover:bg-blue-50/50 ${index % 2 === 1 ? 'bg-blue-50/20' : 'bg-white'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    Client {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                      {getTypeIcon(item.type)} {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    View
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Favorites ★
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <button className="bg-primary text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-primary/90 transition-colors">Check</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{data.length}</span> of{' '}
            <span className="font-medium">{data.length}</span> results
          </p>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              1
            </button>
            <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              3
            </button>
            <button className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              4
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
