## Summary

• Created dashboard-style layout for back-office with sidebar navigation, top navbar, stats cards, and data table
• Maintained all existing functionality (provider select, place search, icon manager, distance panel, map)
• Added visual components matching the reference screenshot design
• Used Tailwind CSS utility classes for responsive design with blue color palette

## Directory tree

- 🆕 src/layouts/DashboardLayout.tsx
- 🆕 src/components/StatsCard.tsx
- 🆕 src/components/WorkspaceTabs.tsx
- 🆕 src/components/DataTable.tsx
- ✏️ src/app/page.tsx
- ✏️ CHANGELOG.md

## File contents

**`src/layouts/DashboardLayout.tsx`**

```tsx
'use client';

import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-16 lg:w-60 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-gray-200">
          <div className="lg:block hidden">
            <h1 className="text-xl font-bold text-gray-900">Venue</h1>
          </div>
          <div className="lg:hidden block">
            <div className="w-8 h-8 bg-blue-600 rounded"></div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
              <div className="w-5 h-5 mr-3 lg:block hidden">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <span className="lg:block hidden">Dashboard</span>
            </a>
            
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <div className="w-5 h-5 mr-3 lg:block hidden">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2.5 4a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1a.5.5 0 01-.5.5H7a.5.5 0 01-.5-.5V9z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="lg:block hidden">Requests</span>
            </a>

            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <div className="w-5 h-5 mr-3 lg:block hidden">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
              <span className="lg:block hidden">Projects</span>
            </a>

            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <div className="w-5 h-5 mr-3 lg:block hidden">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <span className="lg:block hidden">Clients</span>
            </a>

            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <div className="w-5 h-5 mr-3 lg:block hidden">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="lg:block hidden">Providers</span>
            </a>

            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <div className="w-5 h-5 mr-3 lg:block hidden">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="lg:block hidden">Tags & Icons</span>
            </a>

            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <div className="w-5 h-5 mr-3 lg:block hidden">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4zM4 9a2 2 0 100 4h12a2 2 0 100-4H4zM4 15a2 2 0 100 4h12a2 2 0 100-4H4z" />
                </svg>
              </div>
              <span className="lg:block hidden">Destinations</span>
            </a>

            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <div className="w-5 h-5 mr-3 lg:block hidden">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="lg:block hidden">Events</span>
            </a>

            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <div className="w-5 h-5 mr-3 lg:block hidden">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="lg:block hidden">Archived</span>
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-12 flex items-center justify-between px-4">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
              <span className="sr-only">View notifications</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">YR</span>
              </div>
              <div className="hidden lg:block">
                <div className="text-sm font-medium text-gray-900">Youssef Rajaob</div>
                <div className="text-xs text-gray-500">Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

**`src/components/StatsCard.tsx`**

```tsx
interface StatsCardProps {
  label: string;
  value: string;
  trend?: string;
}

export default function StatsCard({ label, value, trend }: StatsCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
          </div>
        </div>
        <div className="mt-1">
          <div className="text-sm font-medium text-gray-500">{label}</div>
          {trend && (
            <div className="text-sm text-gray-400">{trend}</div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**`src/components/WorkspaceTabs.tsx`**

```tsx
export default function WorkspaceTabs() {
  const tabs = [
    { name: 'All', current: true },
    { name: 'Projects', current: false },
    { name: 'Requests Visitor', current: false },
    { name: 'Requests Input', current: false },
    { name: 'Archive', current: false },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <a
            key={tab.name}
            href="#"
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              tab.current
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.name}
          </a>
        ))}
      </nav>
    </div>
  );
}
```

**`src/components/DataTable.tsx`**

```tsx
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
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        </div>

        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Id
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  View
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Favorites
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Client {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getTypeIcon(item.type)} {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    View
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Favorites ★
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900">Check</button>
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
```

**`src/app/page.tsx`**

```tsx
import DashboardLayout from '@/layouts/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import WorkspaceTabs from '@/components/WorkspaceTabs';
import DataTable from '@/components/DataTable';
import MapWrapperAdmin from '@/components/MapWrapperAdmin';
import ProviderSelect from '@/features/backoffice/components/ProviderSelect';
import PlaceSearch from '@/features/backoffice/components/PlaceSearch';
import IconManager from '@/features/backoffice/components/IconManager';
import DistancePanel from '@/features/backoffice/components/DistancePanel';

export default function Home() {
  return (
    <DashboardLayout>
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatsCard label="Projects" value="42" trend="↗️" />
        <StatsCard label="Requests" value="23" trend="↗️" />
        <StatsCard label="Drafts" value="74" trend="↗️" />
      </div>

      {/* Workspace Section */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Workspace</h3>
            <WorkspaceTabs />
          </div>
        </div>
      </div>

      {/* Map and Controls Section */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-1 space-y-4">
              <ProviderSelect />
              <PlaceSearch />
              <IconManager />
              <DistancePanel />
            </div>
            <div className="lg:col-span-3">
              <div className="h-96 w-full">
                <MapWrapperAdmin />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable />
    </DashboardLayout>
  );
}
```
