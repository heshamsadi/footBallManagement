'use client';

export default function Topbar() {
  const pillButtons = [
    'Project Beta',
    'Create Input', 
    'Create Camp',
    'Create Client',
    'Create Provider'
  ];

  const tabs = [
    { name: 'Dashboard', active: true },
    { name: 'Create pitch', active: false },
    { name: 'Contact', active: false },
    { name: 'Create hotel', active: false },
    { name: 'Quotation', active: false },
    { name: 'Private link', active: false },
  ];  return (
    <div className="fixed top-0 left-60 right-0 w-auto z-20 bg-white/95 backdrop-blur-md border-b border-gray-200">
      {/* Main Top Bar */}
      <div className="h-14 flex items-center justify-between px-6">
        {/* Left - Search */}
        <div className="flex items-center space-x-4">
          <div className="relative">            <input
              type="text"
              placeholder="Global Search by Id"
              className="w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400 text-gray-900 bg-white"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Middle - Pill Buttons */}
        <div className="flex items-center space-x-2">
          {pillButtons.map((button) => (
            <button
              key={button}
              className="btn-pill px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
              onClick={() => console.log(`Clicked ${button}`)}
            >
              {button}
            </button>
          ))}
        </div>

        {/* Right - Action Icons */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button 
              className="p-2 text-gray-600 hover:text-primary transition-colors"
              onClick={() => console.log('Bell clicked')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 19V20H3V19L5 17V11C5 7.9 7 5.2 10 4.3V4C10 2.9 10.9 2 12 2S14 2.9 14 4V4.3C17 5.2 19 7.9 19 11V17L21 19ZM12 22C10.9 22 10 21.1 10 20H14C14 21.1 13.1 22 12 22Z"/>
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">5</span>
            </button>
          </div>
          
          <button 
            className="p-2 text-gray-600 hover:text-primary transition-colors"
            onClick={() => console.log('Mail clicked')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
            </svg>
          </button>

          <button 
            className="p-2 text-gray-600 hover:text-primary transition-colors"
            onClick={() => console.log('User clicked')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
            </svg>
          </button>

          <button 
            className="p-2 text-gray-600 hover:text-primary transition-colors"
            onClick={() => console.log('Logout clicked')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17,7L15.59,8.41L18.17,11H8V13H18.17L15.59,15.58L17,17L22,12L17,7M4,5H12V3H4C2.89,3 2,3.89 2,5V19A2,2 0 0,0 4,21H12V19H4V5Z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Tab Strip */}
      <div className="h-9 bg-primary-light border-t border-gray-100 sticky top-14">
        <nav className="flex space-x-1 px-6 py-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                tab.active
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-primary hover:bg-primary/20'
              }`}
              onClick={() => console.log(`Clicked tab ${tab.name}`)}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
