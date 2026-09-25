'use client';

import { Users, UserPlus, CheckCircle2 } from 'lucide-react';

const MOCK_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@mapscrape.com', role: 'Super Admin', status: 'Active' },
  { id: 2, name: 'Data Operator', email: 'operator@mapscrape.com', role: 'Scraper Manager', status: 'Active' },
];

export default function UsersPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 text-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#4F46E5]" /> Users & Team
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage system administrators and team access roles.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-xs cursor-pointer">
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50">
              <th className="px-6 py-3.5">User Name</th>
              <th className="px-6 py-3.5">Email</th>
              <th className="px-6 py-3.5">Role</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {MOCK_USERS.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    {u.name.charAt(0)}
                  </div>
                  {u.name}
                </td>
                <td className="px-6 py-4 text-slate-500 font-medium">{u.email}</td>
                <td className="px-6 py-4">
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {u.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
