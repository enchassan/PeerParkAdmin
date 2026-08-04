import { useEffect, useState } from 'react';
import { Activity, CarFront, CircleDollarSign, Users } from 'lucide-react';
import api from '../services/api';

const statCards = [
  { label: 'Total Users', key: 'users', icon: Users, tone: 'emerald' },
  { label: 'Active Bookings', key: 'bookings', icon: Activity, tone: 'indigo' },
  { label: 'Total Parking Spots', key: 'spots', icon: CarFront, tone: 'amber' },
  { label: 'Total Revenue', key: 'revenue', icon: CircleDollarSign, tone: 'rose' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, bookings: 0, spots: 0, revenue: 0 });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [usersRes, bookingsRes, spotsRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/bookings'),
          api.get('/spots'),
        ]);

        const users = usersRes.data?.users?.length || 0;
        const bookingsList = bookingsRes.data?.bookings || [];
        const spots = spotsRes.data?.spots?.length || 0;
        const revenue = bookingsList.reduce((sum, item) => sum + (Number(item.total_fee) || 0), 0);

        setStats({
          users,
          bookings: bookingsList.length,
          spots,
          revenue,
        });
        setBookings(bookingsList.slice(0, 6));
      } catch (error) {
        console.error('Dashboard load failed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      Pending: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
      Active: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
      Completed: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30',
      Cancelled: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30',
    };

    return statusMap[status] || 'bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30';
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, key, icon: Icon, tone }) => (
          <div key={key} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/20">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-slate-300">{label}</span>
              <span className={`rounded-xl p-2 ${tone === 'emerald' ? 'bg-emerald-500/15 text-emerald-300' : tone === 'indigo' ? 'bg-indigo-500/15 text-indigo-300' : tone === 'amber' ? 'bg-amber-500/15 text-amber-300' : 'bg-rose-500/15 text-rose-300'}`}>
                <Icon size={16} />
              </span>
            </div>
            <p className="text-2xl font-semibold text-white">
              {key === 'revenue' ? `PKR ${stats[key].toLocaleString()}` : stats[key]}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
          <span className="text-xs text-slate-400">Live operational feed</span>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Loading bookings...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Spot</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Fee</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-t border-white/10 text-slate-200">
                    <td className="py-3">{booking.driver_id?.full_name || 'Unknown Driver'}</td>
                    <td className="py-3">{booking.spot_id?.street_address || 'N/A'}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(booking.booking_status || 'Pending')}`}>
                        {booking.booking_status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3">PKR {Number(booking.total_fee || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
