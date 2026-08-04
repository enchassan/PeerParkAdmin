import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await api.get('/bookings');
        setBookings(response.data?.bookings || []);
      } catch (error) {
        console.error('Failed to load bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === 'All' || booking.booking_status === statusFilter;
      const searchText = `${booking.driver_id?.full_name || ''} ${booking.spot_id?.street_address || ''}`.toLowerCase();
      const matchesSearch = searchText.includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  const getStatusClass = (status) => {
    const map = {
      Pending: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
      Confirmed: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
      Active_Parking: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30',
      Completed: 'bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30',
      Declined: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30',
      Expired: 'bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30',
    };

    return map[status] || 'bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Bookings Management</h1>
        <p className="text-sm text-slate-400">Track and filter all platform-wide parking reservations.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search by user or spot"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none md:max-w-xs"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Active_Parking</option>
            <option>Completed</option>
            <option>Declined</option>
            <option>Expired</option>
          </select>
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
                  <th className="pb-3">Check-in</th>
                  <th className="pb-3">Check-out</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Fee</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-t border-white/10 text-slate-200">
                    <td className="py-3">{booking.driver_id?.full_name || 'Unknown Driver'}</td>
                    <td className="py-3">{booking.spot_id?.street_address || 'Unknown Spot'}</td>
                    <td className="py-3">{new Date(booking.scheduled_checkin).toLocaleString()}</td>
                    <td className="py-3">{new Date(booking.scheduled_checkout).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(booking.booking_status)}`}>
                        {booking.booking_status}
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
