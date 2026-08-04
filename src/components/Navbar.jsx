import { Bell, Search } from 'lucide-react';

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem('peerpark_admin_user') || '{}');

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-300">
          <Search size={16} />
          <input
            className="w-48 bg-transparent text-sm outline-none placeholder:text-slate-500"
            placeholder="Search admin"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-xl border border-white/10 bg-slate-900 p-2 text-slate-300 transition hover:text-white"
          >
            <Bell size={16} />
          </button>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className="text-sm font-semibold text-emerald-300">{user.full_name || 'Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
