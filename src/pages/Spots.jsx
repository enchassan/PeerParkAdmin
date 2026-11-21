import { useEffect, useState } from 'react';
import { Ban, Eye, Trash2, X } from 'lucide-react';
import api from '../services/api';

export default function Spots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
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

  const handleSuspend = async (spotId) => {
    try {
      const response = await api.patch(`/admin/spots/${spotId}/suspend`);
      const updated = response.data?.spot;
      setSpots((prev) =>
        prev.map((spot) =>
          spot._id === spotId
            ? { ...spot, spot_status: updated?.spot_status || 'Suspended', is_active: false }
            : spot
        )
      );
      if (selectedSpot?._id === spotId) {
        setSelectedSpot((prev) => ({ ...prev, spot_status: 'Suspended', is_active: false }));
      }
    } catch (error) {
      console.error('Failed to suspend spot:', error);
    }
  };

  const handleDelete = async (spotId) => {
    try {
      await api.delete(`/spots/${spotId}`);
      setSpots((prev) => prev.filter((spot) => spot._id !== spotId));
      if (selectedSpot?._id === spotId) {
        setSelectedSpot(null);
      }
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

  const getStatusClass = (status) => {
    if (status === 'Approved') return 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30';
    if (status === 'Suspended') return 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30';
    return 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Spot Management</h1>
          <p className="text-sm text-slate-400">Review all live parking inventory and moderate non-compliant listings.</p>
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
                    <td className="py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(spot.spot_status)}`}>
                        {spot.spot_status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedSpot(spot)}
                          title="View Details"
                          className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/10 hover:text-white"
                        >
                          <Eye size={15} />
                        </button>
                        {spot.spot_status !== 'Suspended' && (
                          <button
                            type="button"
                            onClick={() => handleSuspend(spot._id)}
                            title="Suspend Spot"
                            className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-amber-300 hover:bg-amber-500/20"
                          >
                            <Ban size={15} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(spot._id)}
                          title="Delete Spot"
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

      {/* Spot Details Modal */}
      {selectedSpot ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">{selectedSpot.street_address}</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Host: {selectedSpot.host_id?.full_name || 'Unknown'} ({selectedSpot.host_id?.email || 'No email'})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSpot(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex justify-between rounded-xl border border-white/10 bg-slate-950 p-3">
                <span className="text-slate-400">Hourly Rate</span>
                <span className="font-semibold text-emerald-400">
                  PKR {Number(selectedSpot.hourly_rate || 0).toLocaleString()}/hr
                </span>
              </div>
              <div className="flex justify-between rounded-xl border border-white/10 bg-slate-950 p-3">
                <span className="text-slate-400">Coordinates (Lat, Lng)</span>
                <span className="font-mono text-xs text-white">
                  {selectedSpot.location?.coordinates?.[1]?.toFixed(5)}, {selectedSpot.location?.coordinates?.[0]?.toFixed(5)}
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950 p-3">
                <p className="text-xs text-slate-400">Access Guide / Special Instructions</p>
                <p className="mt-1 text-white">
                  {selectedSpot.special_instructions || 'No special instructions provided.'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
              {selectedSpot.spot_status !== 'Suspended' && (
                <button
                  type="button"
                  onClick={() => handleSuspend(selectedSpot._id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 hover:bg-amber-500/20"
                >
                  <Ban size={15} />
                  Suspend Listing
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedSpot(null)}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Add Spot Modal */}
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
                    step="any"
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
                    step="any"
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