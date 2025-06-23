'use client';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', active: false },
    { name: 'Camps', active: true },
    { name: 'Requests', active: false, badge: '95' },
    { name: 'Projects', active: false },
    { name: 'Clients', active: false },
    { name: 'Providers', active: false },
    { name: 'Webox', active: false, badge: '43' },
    { name: 'Contacts', active: false },
    { name: 'Destinations', active: false },
    { name: 'Airports', active: false },
    { name: 'Events', active: false },
    { name: 'Tags & Icons', active: false },
    { name: 'Users Management', active: false },
    { name: 'Archived', active: false },
  ];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Dashboard':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        );
      case 'Camps':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
          </svg>
        );
      case 'Requests':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'Projects':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
        );
      case 'Clients':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  return (
    <div className="w-60 bg-gray-sidebar border-r border-gray-200 flex flex-col fixed h-full z-30">
      {/* Logo */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" fill="#0073e6" stroke="white" strokeWidth="2"/>
            <path d="M12 18L24 12L36 18L30 30L18 30Z" fill="white"/>
            <path d="M24 12V36M12 18L36 30M36 18L12 30" stroke="#0073e6" strokeWidth="1.5"/>
          </svg>
          <div>
            <div className="font-semibold text-gray-900 text-sm">FOOTBALL</div>
            <div className="text-primary text-xs font-medium">VENUE.com</div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-100 bg-primary-light/30">
        <div className="text-sm font-semibold text-gray-900">Youssef Rajajoub</div>
        <div className="text-xs text-gray-600 font-medium">Super admin</div>
        <div className="text-xs text-gray-500 mt-1">Last Connection: 22/04/2024 23:26</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <div className="space-y-1 px-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href="#"
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                item.active
                  ? 'bg-primary-light text-primary border-r-3 border-primary shadow-sm'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-primary'
              }`}
              onClick={() => console.log(`Clicked ${item.name}`)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex-shrink-0">
                  {getIcon(item.name)}
                </div>
                <span className="font-medium">{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold min-w-6 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
