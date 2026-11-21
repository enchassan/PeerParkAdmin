import { useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
      event.preventDefault();
      setLoading(true);
      setError('');

      try {
        const response = await api.post('/auth/login', form);
        const { token, user } = response.data;

        if (user?.role !== 'SuperAdmin') {
          setError('Access denied. SuperAdmin privileges are required to access this portal.');
          return;
        }

        localStorage.setItem('peerpark_admin_token', token);
        localStorage.setItem('peerpark_admin_user', JSON.stringify(user));

        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-emerald-950/30 backdrop-blur">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
            <ShieldCheck size={24} />
          </div>
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">PeerPark Admin</p>
          <h1 className="mt-3 text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to manage parking operations.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950 px-4 py-3">
              <Mail size={16} className="text-slate-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                placeholder="admin@peerpark.com"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Password</span>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950 px-4 py-3">
              <LockKeyhole size={16} className="text-slate-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                placeholder="••••••••"
                required
              />
            </div>
          </label>

          {error ? <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
