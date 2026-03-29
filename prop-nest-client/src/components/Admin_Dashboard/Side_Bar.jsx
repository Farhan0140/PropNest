import { useState } from 'react';
import { 
  Building2, 
  Users, 
  CreditCard, 
  Settings, 
  Menu, 
  User,  
  ChevronDown,
  LayoutDashboard,
  Bell,
} from 'lucide-react';
import { Outlet, useNavigate } from 'react-router';

const Side_Bar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);

  const menuItems = [
    {
      id: 0,
      label: 'Dashboard',
      icon: LayoutDashboard,
      to: "/admin-dashboard"
    },
    {
      id: 1,
      label: 'Properties',
      icon: Building2,
      submenus: {
        allProperties: { label: 'All Properties', path: '/properties/all' },
        addProperty: { label: 'Add Property', path: '/properties/add' },
        propertySettings: { label: 'Property Settings', path: '/properties/settings' }
      }
    },
    {
      id: 2,
      label: 'Tenants',
      icon: Users,
      submenus: {
        tenantList: { label: 'Tenant List', path: '/tenants/list' },
        addTenant: { label: 'Add Tenant', path: '/tenants/add' },
        tenantRequests: { label: 'Tenant Requests', path: '/tenants/requests' }
      }
    },
    {
      id: 3,
      label: 'Payments',
      icon: CreditCard,
      submenus: {
        paymentHistory: { label: 'Payment History', path: '/payments/history' },
        invoices: { label: 'Invoices', path: '/payments/invoices' },
        paymentSettings: { label: 'Payment Settings', path: '/payments/settings' }
      }
    },
    {
      id: 4,
      label: 'Settings',
      icon: Settings,
      submenus: {
        general: { label: 'General', path: '/settings/general' },
        security: { label: 'Security', path: '/settings/security' },
        notifications: { label: 'Notifications', path: '/settings/notifications' }
      }
    }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    alert("Logged in successfully!");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert("Logged out successfully!");
  };

  const handleNotificationClick = () => {
    alert(`You have ${notificationCount} new notifications!`);
    setNotificationCount(0);
  };

  const handleProfileClick = () => {
    alert("Opening profile settings...");
  };

  const handleSubmenuClick = (submenuItem) => {
    alert(`Navigating to: ${submenuItem.label}`);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-200 font-sans">
      {/* Header */}
      <header className="
        fixed top-0 left-0 right-0 z-50
        h-16 bg-white border-b-2 border-black
        shadow-[0px_4px_0px_0px_rgba(0,0,0,0.7)]
        flex items-center justify-between px-4
      ">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="
              w-10 h-10 rounded 
              border-2 border-black bg-white 
              shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
              cursor-pointer 
              active:shadow-none active:translate-x-0.75 active:translate-y-0.75 transition-all
              flex items-center justify-center
            "
          >
            <Menu className="w-6 h-6 text-black" />
          </button>
          <h1 className="text-xl font-black text-gray-800">PropNest</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Button */}
          <button
            onClick={handleNotificationClick}
            className="
              relative w-10 h-10 rounded 
              border-2 border-black bg-white 
              shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
              cursor-pointer 
              active:shadow-none active:translate-x-0.75 active:translate-y-0.75 transition-all
              flex items-center justify-center
            "
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 border-2 border-black rounded-full flex items-center justify-center text-xs font-black text-white">
                {notificationCount}
              </span>
            )}
          </button>

          {isLoggedIn ? (
            <>
              {/* Profile Button in Header */}
              <button 
                onClick={handleProfileClick}
                className="
                  flex items-center gap-2 px-4 py-2 rounded 
                  border-2 border-black bg-white 
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                  cursor-pointer 
                  active:shadow-none active:translate-x-0.75 active:translate-y-0.75 transition-all
                "
              >
                <User className="w-5 h-5" />
                <span className="font-semibold text-gray-800 hidden sm:block">Profile</span>
              </button>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="
                  px-4 py-2 rounded 
                  border-2 border-black bg-white 
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                  cursor-pointer 
                  active:shadow-none active:translate-x-0.75 active:translate-y-0.75 transition-all
                  font-semibold text-gray-800
                "
              >
                Logout
              </button>
            </>
          ) : (
            /* Login Button */
            <button
              onClick={handleLogin}
              className="
                px-4 py-2 rounded 
                border-2 border-black bg-white 
                shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                cursor-pointer 
                active:shadow-none active:translate-x-0.75 active:translate-y-0.75 transition-all
                font-semibold text-gray-800
              "
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 bottom-0 z-50
        bg-white border-r-2 border-black
        shadow-[4px_0px_0px_0px_rgba(0,0,0,0.7)]
        transition-all duration-300 ease-in-out
        w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        overflow-hidden flex flex-col
      `}>
        {/* Scrollable Navigation Menu */}
        <nav className="p-4 flex flex-col gap-2 overflow-y-auto flex-1">
          
          {/* Menu Items rendered with map */}
          {menuItems.map((menuItem) => (
            <div key={menuItem.id}>
              <button
                onClick={() => {
                    if (menuItem?.submenus) {
                      toggleSubmenu(menuItem.id);
                    } else if (menuItem?.to) {
                      navigate(menuItem.to);
                      setSidebarOpen(false);
                    }
                  }
                }
                className="
                  w-full flex items-center gap-3 px-4 py-3 rounded 
                  border-2 border-black bg-white 
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                  cursor-pointer 
                  active:shadow-none active:translate-x-0.75 active:translate-y-0.75 transition-all
                  font-semibold text-gray-800
                "
              >
                <menuItem.icon className="w-5 h-5" />
                <span>{menuItem.label}</span>
                {
                  menuItem?.submenus && (
                    <ChevronDown 
                      className={`w-4 h-4 ml-auto transition-transform ${activeSubmenu === menuItem.id ? 'rotate-180' : ''}`} 
                    />
                  )
                }
              </button>
              
              {activeSubmenu === menuItem.id && (
                <div className="ml-4 mt-2 flex flex-col gap-2 border-l-2 border-black pl-4">
                  {/* Submenu items rendered with map from object */}
                  {Object.entries(menuItem.submenus).map(([key, submenuItem]) => (
                    <button 
                      key={key}
                      onClick={() => handleSubmenuClick(submenuItem)}
                      className="text-left px-3 py-2 rounded border-2 border-black bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.7)] cursor-pointer active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all text-sm font-semibold text-gray-700"
                    >
                      {submenuItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

        </nav>

        {/* Fixed Bottom Profile Section */}
        <div className="p-4 border-t-2 border-black bg-white">
          <button
            onClick={handleProfileClick}
            className="
              w-full flex items-center gap-3 px-4 py-3 rounded 
              border-2 border-black bg-gray-100 
              shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
              cursor-pointer 
              active:shadow-none active:translate-x-0.75 active:translate-y-0.75 transition-all
              font-semibold text-gray-800
            "
          >
            <User className="w-5 h-5" />
            <span>My Profile</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        onClick={() => sidebarOpen && setSidebarOpen(false)}
        className={`
          pt-20 px-4 transition-all duration-300 ease-in-out
        `}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Side_Bar;
