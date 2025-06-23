'use client';

export default function WorkspaceTabs() {
  const tabs = [
    { name: 'All', current: true },
    { name: 'Drafts', current: false },
    { name: 'Private Links', current: false },
    { name: 'Quotation', current: false },
    { name: 'Tip', current: false },
    { name: 'Project Beta', current: false },
  ];
  return (
    <div className="bg-primary rounded-lg shadow-md p-1 flex space-x-1">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          className={`btn-pill px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            tab.current
              ? 'bg-white text-primary shadow-sm'
              : 'text-white hover:bg-white/20'
          }`}
          onClick={() => console.log(`Clicked workspace tab ${tab.name}`)}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
}
