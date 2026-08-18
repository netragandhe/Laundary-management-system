import React, { useState } from 'react';
import { HiTicket } from 'react-icons/hi';

const SupportTickets = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const stats = [
    { label: 'Total', value: '1', color: '#3b82f6' },
    { label: 'Open', value: '0', color: '#ef4444' },
    { label: 'Replied', value: '1', color: '#10b981' },
    { label: 'Closed', value: '0', color: '#6b7280' }
  ];

  const tickets = [
    {
      id: 'TKT-1786006334931-390',
      gymAdmin: 'anytime',
      gymAdminSub: 'anytime',
      subject: 'Payment',
      priority: 'Medium',
      status: 'Replied',
      updated: '6/8/2026'
    }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <HiTicket className="text-blue-500" size={24} />
          Support Tickets
        </h1>
        <p className="text-secondary text-sm mt-1">
          Manage all business owner support requests and inquiries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="surface-card p-5 rounded-2xl border border-border flex flex-col justify-center shadow-sm">
            <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: stat.color }}>{stat.value}</h2>
            <p className="text-secondary text-sm font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters Section */}
      <div className="surface-card p-5 rounded-2xl border border-border flex flex-col md:flex-row md:items-end gap-4 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Status</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field rounded-xl border border-border px-3 py-1.5 bg-surface-alt text-primary text-sm min-w-[140px] outline-none"
          >
            <option>All</option>
            <option>Open</option>
            <option>Replied</option>
            <option>Closed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Priority</label>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input-field rounded-xl border border-border px-3 py-1.5 bg-surface-alt text-primary text-sm min-w-[140px] outline-none"
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
            Apply Filters
          </button>
          <button className="border border-border text-primary hover:bg-surface-hover text-sm font-semibold px-4 py-2 rounded-xl transition">
            Reset
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="surface-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs font-semibold text-secondary uppercase tracking-wider bg-surface-alt">
                <th className="p-4">Ticket #</th>
                <th className="p-4">Owner / Admin</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Updated</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets.map((t, idx) => (
                <tr key={idx} className="hover:bg-surface-hover transition-colors text-sm">
                  <td className="p-4 font-mono text-secondary text-xs">{t.id}</td>
                  <td className="p-4">
                    <p className="font-semibold text-primary">{t.gymAdmin}</p>
                    <p className="text-xs text-secondary mt-0.5">{t.gymAdminSub}</p>
                  </td>
                  <td className="p-4 font-medium text-primary">{t.subject}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      t.priority === 'High' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/15' :
                      t.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/15' :
                      'bg-blue-500/10 text-blue-500 border border-blue-500/15'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      t.status === 'Open' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/15' :
                      t.status === 'Replied' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/15' :
                      'bg-slate-500/10 text-slate-500 border border-slate-500/15'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-secondary">{t.updated}</td>
                  <td className="p-4 text-right">
                    <button className="border border-border hover:bg-surface-hover text-primary font-semibold text-xs px-3 py-1.5 rounded-xl transition">
                      Open &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default SupportTickets;
