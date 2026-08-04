import { useEffect, useState } from 'react';
import { MapPinned, Trash2, Eye } from 'lucide-react';
import api from '../services/api';

export default function Spots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    street_address: '',
    hourly_rate: '',
    location: { coordinates: ['', ''] },
  });

  const loadSpots = async () => {
    try {
      const response = await api.get('/spots');
      setSpots(response.data?.spots || []);
    } catch (error) {
      console.error('Failed to fetch spots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpots();
  }, []);

  const handleDelete = async (spotId) => {
    try {
      await api.delete(`/spots/${spotId}`);
      setSpots((prev) => prev.filter((spot) => spot._id !== spotId));
    } catch (error) {
      console.error('Failed to delete spot:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        ...form,
        hourly_rate: Number(form.hourly_rate),
        location: {
          coordinates: [Number(form.location.coordinates[1]), Number(form.location.coordinates[0])],
        },
      };

      const response = await api.post('/spots/create', payload);
      setSpots((prev) => [response.data.spot, ...prev]);
      setShowModal(false);
      setForm({ street_address: '', hourly_rate: '', location: { coordinates: ['', ''] } });
    } catch (error) {
      console.error('Failed to create spot:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Spot Management</h1>
          <p className="text-sm text-slate-400">Review all live parking inventory and manage onboarding.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Add New Spot
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        {loading ? (
          <p className="text-sm text-slate-400">Loading spots...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3">Address</th>
                  <th className="pb-3">Host</th>
                  <th className="pb-3">Rate</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {spots.map((spot) => (
                  <tr key={spot._id} className="border-t border-white/10 text-slate-200">
                    <td className="py-3">{spot.street_address}</td>
                    <td className="py-3">{spot.host_id?.full_name || 'Unknown host'}</td>
                    <td className="py-3">PKR {Number(spot.hourly_rate || 0).toLocaleString()}/hr</td>
                    <td className="py-3">{spot.spot_status}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button type="button" className="rounded-lg border border-white/10 p-2 text-slate-300 hover:text-white">
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(spot._id)}
                          className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-300 hover:bg-rose-500/20"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Add Parking Spot</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400">
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Street address</span>
                <input
                  type="text"
                  value={form.street_address}
                  onChange={(e) => setForm({ ...form, street_address: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Hourly rate</span>
                <input
                  type="number"
                  value={form.hourly_rate}
                  onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Latitude</span>
                  <input
                    type="number"
                    value={form.location.coordinates[0]}
                    onChange={(e) => setForm({
                      ...form,
                      location: { coordinates: [e.target.value, form.location.coordinates[1]] },
                    })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Longitude</span>
                  <input
                    type="number"
                    value={form.location.coordinates[1]}
                    onChange={(e) => setForm({
                      ...form,
                      location: { coordinates: [form.location.coordinates[0], e.target.value] },
                    })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
                    required
                  />
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950"
              >
                Save Spot
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
