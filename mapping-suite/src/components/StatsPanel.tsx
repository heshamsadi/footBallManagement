export default function StatsPanel() {
  const stats = [
    { label: 'Projects', value: '42', trend: 'up' },
    { label: 'Requests Visitor', value: '23', trend: 'down' },
    { label: 'Requests Input', value: '12', trend: 'up' },
    { label: 'Private Links', value: '56', trend: 'up' },
    { label: 'Quotations', value: '28', trend: 'down' },
    { label: 'Drafts', value: '74', trend: 'up' },
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return (
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L10 4.414 4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L10 15.586l5.293-5.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    );
  };
  return (
    <div className="absolute left-4 top-4 z-20 space-y-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl shadow-md p-3 w-32 border border-gray-100/50 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-xl font-bold text-gray-900 leading-tight">{stat.value}</div>
              <div className="text-xs text-gray-600 mt-0.5 leading-tight">{stat.label}</div>
            </div>
            <div className="flex-shrink-0 ml-1">
              {getTrendIcon(stat.trend)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
