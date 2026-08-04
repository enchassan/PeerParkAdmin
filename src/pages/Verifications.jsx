import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import api from '../services/api';

export default function Verifications() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error('Verification update failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Host Verifications</h1>
        <p className="text-sm text-slate-400">Review pending identity and profile submissions.</p>
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
                    <p className="text-sm text-slate-400">CNIC: {user.cnic_matrix?.cnic_number || 'Not supplied'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDecision(user._id, true)}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950"
                    >
                      <Check size={15} />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision(user._id, false)}
                      className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-300"
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
    </div>
  );
}
