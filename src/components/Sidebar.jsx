import { LayoutDashboard, MapPinned, ShieldCheck, CalendarRange, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/spots', label: 'Spot Management', icon: MapPinned },
  { to: '/verifications', label: 'Host Verifications', icon: ShieldCheck },
  { to: '/bookings', label: 'Bookings', icon: CalendarRange },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('peerpark_admin_token');
    localStorage.removeItem('peerpark_admin_user');
    navigate('/login');
  };

  return (
    <aside className="sticky top-0 h-screen w-full border-b border-white/10 bg-slate-950/90 backdrop-blur xl:w-80 xl:border-b-0 xl:border-r">
      <div className="flex h-full flex-col justify-between p-5">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/15 px-3 py-2 text-emerald-400 ring-1 ring-emerald-400/30">
              <MapPinned size={18} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">PeerPark</h1>
              <p className="text-xs text-slate-400">Admin Control Center</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-rose-500/40 hover:text-rose-300"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
