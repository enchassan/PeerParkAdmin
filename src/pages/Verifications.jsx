import { useEffect, useState } from 'react';
import { Check, Eye, ShieldCheck, X } from 'lucide-react';
import api from '../services/api';

export default function Verifications() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadVerifications = async () => {
    try {
      const response = await api.get('/admin/verifications');
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error('Failed to load verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerifications();
  }, []);

  const handleDecision = async (userId, approve) => {
    try {
      if (approve) {
        await api.patch(`/admin/users/${userId}/approve`);
      } else {
        await api.delete(`/admin/users/${userId}`);
      }
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      if (selectedUser?._id === userId) {
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Verification update failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Host Verifications</h1>
        <p className="text-sm text-slate-400">
          Review pending identity and CNIC submissions before granting host privileges.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        {loading ? (
          <p className="text-sm text-slate-400">Loading pending verifications...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-slate-400">No pending verifications available.</p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user._id} className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-base font-semibold text-white">{user.full_name}</p>
                    <p className="text-sm text-slate-400">{user.email}</p>
                    <p className="text-sm text-slate-400">Phone: {user.phone_number}</p>
                    <p className="text-sm text-slate-400">Role: {user.role}</p>
                    <p className="text-sm text-emerald-400 font-medium mt-1">
                      CNIC: {user.cnic_matrix?.cnic_number || 'Not supplied'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                    >
                      <Eye size={15} />
                      View CNIC
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision(user._id, true)}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                    >
                      <Check size={15} />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision(user._id, false)}
                      className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/20"
                    >
                      <X size={15} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CNIC Asset Inspection Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{selectedUser.full_name}</h2>
                  <p className="text-xs text-slate-400">
                    CNIC: {selectedUser.cnic_matrix?.cnic_number || 'Not supplied'} • {selectedUser.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-slate-950 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  CNIC Front
                </p>
                {selectedUser.cnic_matrix?.cnic_front_url ? (
                  <img
                    src={selectedUser.cnic_matrix.cnic_front_url}
                    alt="CNIC Front"
                    className="h-44 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-white/10 text-xs text-slate-500">
                    No front image uploaded
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  CNIC Back
                </p>
                {selectedUser.cnic_matrix?.cnic_back_url ? (
                  <img
                    src={selectedUser.cnic_matrix.cnic_back_url}
                    alt="CNIC Back"
                    className="h-44 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-white/10 text-xs text-slate-500">
                    No back image uploaded
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => handleDecision(selectedUser._id, false)}
                className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/20"
              >
                <X size={15} />
                Reject Entity
              </button>
              <button
                type="button"
                onClick={() => handleDecision(selectedUser._id, true)}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                <Check size={15} />
                Approve Entity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}