import { useState, useRef, useEffect } from 'react';
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
  Receipt,
} from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import useAuthContext from '../../hooks/Auth/useAuthContext';

const Side_Bar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  const profileContainerRef = useRef(null);
  const { user, authToken } = useAuthContext();
  
  const navigate = useNavigate();

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileContainerRef.current && !profileContainerRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const menuItems = [
    {
      id: 0,
      label: 'Dashboard',
      icon: LayoutDashboard,
      to: "/admin-dashboard"
    },
    {
      id: 1,
      label: 'Property',
      icon: Building2,
      submenus: {
        properties: { label: 'Properties', path: 'property-dashboard' },
        units: { label: 'Units', path: 'unit-dashboard' },
      }
    },
    {
      id: 2,
      label: 'Renter',
      icon: Users,
      submenus: {
        tenantList: { label: 'Renter List', path: 'renter-dashboard' },
        currentRenters: {label: 'Current Renters', path: 'current-renter-dashboard'},
        previousRenters: {label: 'Previous Renters', path: 'previous-renter-dashboard'}
      }
    },
    {
      id: 3,
      label: 'Bills',
      icon: Receipt,
      submenus: {
        electricity: { label: 'Electricity', path: 'electricity-dashboard' },
        createBills: { label: 'Generate Bills', path: 'bills-dashboard'},
      }
    },
    {
      id: 4,
      label: 'Rent History',
      icon:  Building2,
      submenus: {
        allRents: {label: 'All Rents', path: 'rent-management-dashboard'},
      }
    },
    {
      id: 5,
      label: 'Payments',
      icon: CreditCard,
      submenus: {
        paymentHistory: { label: 'Payment History', path: '/payments/history' },
        invoices: { label: 'Invoices', path: '/payments/invoices' },
        paymentSettings: { label: 'Payment Settings', path: '/payments/settings' }
      }
    },
    {
      id: 6,
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

  const handleLogout = () => {
    setProfileMenuOpen(false);
    alert("Logged out successfully!");
  };

  const handleNotificationClick = () => {
    alert(`You have ${notificationCount} new notifications!`);
    setNotificationCount(0);
  };

  const handleProfileClick = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleProfileMenuClick = () => {
    alert("Opening profile settings...");
    setProfileMenuOpen(false);
  };

  const handleSubmenuClick = (submenuItem) => {
    alert(`Navigating to: ${submenuItem.label}`);
  };

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
            <Bell className="w-5 h-5 text-black" />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 border-2 border-black rounded-full flex items-center justify-center text-xs font-black text-white">
                {notificationCount}
              </span>
            )}
          </button>

          {authToken ? (
            <>
              {/* Profile Dropdown */}
              <div className="relative" ref={profileContainerRef}>
                {/* Profile Trigger */}
                <div
                  onClick={handleProfileClick}
                  className="
                    px-2.5 py-2 rounded-md
                    border-2 border-black bg-white
                    shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)]
                    active:shadow-none active:translate-x-0.75 active:translate-y-0.75
                    cursor-pointer transition-all select-none
                  "
                >
                  <div className="w-5 h-5 flex justify-center items-center">
                    <User size={18} strokeWidth={2.5} className='text-black' />
                  </div>
                  
                  
                </div>

                {/* Dropdown Menu */}
                <div
                  className={`
                    absolute right-0 mt-2 w-40
                    bg-white border-2 border-black
                    shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)]
                    rounded overflow-hidden z-50
                    transition-all duration-200 origin-top-right
                    ${
                      profileMenuOpen
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }
                  `}
                >
                  {/* Name Field */}
                  <div className="px-3 py-2 border-b-2 border-black bg-gray-50">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                      Signed in as
                    </p>
                    <div className="font-bold text-sm truncate text-black">{user?.full_name}</div>
                  </div>

                  {/* Menu Actions */}
                  <div className="p-1 flex flex-col gap-1">
                    {/* Profile Button */}
                    <button
                      onClick={handleProfileMenuClick}
                      className="w-full text-left px-3 py-2 font-bold text-gray-800 text-sm hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-colors rounded"
                    >
                      Profile
                    </button>

                    {/* Settings Button */}
                    <button
                      onClick={handleProfileMenuClick}
                      className="w-full text-left px-3 py-2 font-bold text-gray-800 text-sm hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-colors rounded"
                    >
                      Settings
                    </button>

                    <div className="h-px w-full bg-black my-0.5"></div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 font-bold text-red-600 text-sm hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-red-500 transition-colors rounded"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Login Button */
            <button
              onClick={() => navigate("/login")}
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
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded 
                  border-2 border-black bg-white 
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                  cursor-pointer 
                  active:shadow-none active:translate-x-0.75 active:translate-y-0.75 transition-all
                  font-semibold text-gray-800
                  hover:bg-blue-200
                  active:bg-green-200 active:text-black
                  focus:bg-gray-500 focus:text-white
                `}
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
                      onClick={() => {
                          navigate(submenuItem.path)
                          setSidebarOpen(false)
                        }
                      }
                      key={key}
                      className="text-left px-3 py-2 rounded border-2 focus:bg-gray-500 focus:text-white hover:bg-blue-200 border-black bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.7)] cursor-pointer active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all text-sm font-semibold text-gray-700"
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
          {
            authToken ? (
              <button
                onClick={handleProfileMenuClick}
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
                <span>{user?.full_name}</span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="
                  px-4 py-2 rounded 
                  w-full
                  border-2 border-black bg-white 
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                  cursor-pointer 
                  active:shadow-none active:translate-x-0.75 active:translate-y-0.75 transition-all
                  font-semibold text-gray-800
                "
              >
                Login
              </button>
            )
          }
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
