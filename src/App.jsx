import React, { useState } from 'react';

export default function App() {
  // 1. Core Reactive States for Live Data Simulation
  const [currentTab, setCurrentTab] = useState('overview'); // overview, listings, disputes
  
  const [listings, setListings] = useState([
    { id: 'L-101', host: 'Saad Atif', type: 'DHA Phase 5 Driveway', status: 'Pending', rate: 'Rs 120/hr' },
    { id: 'L-102', host: 'Muhammad Awais', type: 'Gulberg Covered Garage', status: 'Approved', rate: 'Rs 150/hr' },
    { id: 'L-103', host: 'Umer Shehzad', type: 'Johar Town Gated Spot', status: 'Pending', rate: 'Rs 100/hr' }
  ]);

  const [disputes, setDisputes] = useState([
    { id: 'D-901', raisedBy: 'Driver (Ali Rao)', reason: 'Spot was blocked by host vehicle', status: 'Open', details: 'Arrived at the location at 2:00 PM but a private civic was parked inside the designated driveway spot.' },
    { id: 'D-902', raisedBy: 'Host (Zainab K.)', reason: 'Overstayed booking period', status: 'Open', details: 'The driver extended their session without authorization, blocking the next scheduled parking reservation.' }
  ]);

  // 2. Interactive Action Handlers (State Mutations)
  const handleUpdateListingStatus = (id, newStatus) => {
    setListings(prevListings =>
      prevListings.map(item => item.id === id ? { ...item, status: newStatus } : item)
    );
  };

  const handleResolveDispute = (id) => {
    setDisputes(prevDisputes =>
      prevDisputes.map(ticket => ticket.id === id ? { ...ticket, status: 'Resolved' } : ticket)
    );
  };

  // 3. Dynamic Aggregation Metrics
  const totalPendingListings = listings.filter(l => l.status === 'Pending').length;
  const totalActiveListings = listings.filter(l => l.status === 'Approved').length;
  const totalOpenDisputes = disputes.filter(d => d.status === 'Open').length;

  return (
    <div className="min-h-screen bg-bg text-text1 font-dmsans flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION WORKFLOWS */}
      <aside className="w-full md:w-64 bg-bg2 border-b md:border-b-0 md:border-r border-border1 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="font-rubik font-bold text-xl text-green1 tracking-tight mb-8">
            Peer<span className="text-text1">Park</span> <span className="text-xs bg-surface border border-border2 px-2 py-0.5 rounded text-amber1">Admin</span>
          </div>
          <nav className="space-y-2">
            <button 
              onClick={() => setCurrentTab('overview')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${
                currentTab === 'overview' ? 'bg-surface border-border2 text-green1' : 'border-transparent text-text2 hover:text-text1 hover:bg-surface/50'
              }`}>
              📊 System Overview
            </button>
            <button 
              onClick={() => setCurrentTab('listings')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${
                currentTab === 'listings' ? 'bg-surface border-border2 text-green1' : 'border-transparent text-text2 hover:text-text1 hover:bg-surface/50'
              }`}>
              🏠 Listing Approvals ({totalPendingListings})
            </button>
            <button 
              onClick={() => setCurrentTab('disputes')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${
                currentTab === 'disputes' ? 'bg-surface border-border2 text-green1' : 'border-transparent text-text2 hover:text-text1 hover:bg-surface/50'
              }`}>
              ⚖️ Dispute Center ({totalOpenDisputes})
            </button>
          </nav>
        </div>
        <div className="text-[0.7rem] text-text3 pt-4 border-t border-border1">
          BSCS Computer Science · UOL
        </div>
      </aside>

      {/* MAIN SYSTEM DASHBOARD PORTAL */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="mb-8">
          <h1 className="font-rubik text-2xl font-bold text-text1 tracking-tight">
            {currentTab === 'overview' && "System Control Matrix"}
            {currentTab === 'listings' && "Infrastructure Verification Registry"}
            {currentTab === 'disputes' && "Arbitration & Resolution Hub"}
          </h1>
          <p className="text-text2 font-light text-sm mt-1">
            {currentTab === 'overview' && "High-level visual tracking of active platform operations and parameters."}
            {currentTab === 'listings' && "Review property declarations and verify multi-media safety components for security."}
            {currentTab === 'disputes' && "Investigate cross-user conflicts, review case telemetry logs, and settle transactions."}
          </p>
        </header>

        {/* INTERACTIVE SCORECARD STATS MODULE */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface border border-border1 rounded-xl p-5 hover:border-border2 transition-colors">
            <div className="font-rubik text-2xl font-bold text-green1">{totalActiveListings}</div>
            <div className="text-[0.68rem] text-text3 uppercase font-bold tracking-wider mt-1">Active Cloud Spots</div>
          </div>
          <div className="bg-surface border border-border1 rounded-xl p-5 hover:border-border2 transition-colors">
            <div className="font-rubik text-2xl font-bold text-amber1">{totalPendingListings}</div>
            <div className="text-[0.68rem] text-text3 uppercase font-bold tracking-wider mt-1">Pending Requests</div>
          </div>
          <div className="bg-surface border border-border1 rounded-xl p-5 hover:border-border2 transition-colors">
            <div className="font-rubik text-2xl font-bold text-red1">{totalOpenDisputes}</div>
            <div className="text-[0.68rem] text-text3 uppercase font-bold tracking-wider mt-1">Open Disputed Escrows</div>
          </div>
        </section>

        {/* CONDITIONAL CONDITIONAL LAYOUT ROUTING SWITCH */}
        {currentTab === 'overview' && (
          <div className="bg-bg2 border border-border1 rounded-xl p-6 text-center text-text2 font-light text-sm">
            <p>Welcome back to the command node. Select an operational queue from the sidebar navigation to handle active user operations.</p>
          </div>
        )}

        {currentTab === 'listings' && (
          <div className="bg-bg2 border border-border1 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border1 bg-bg3">
              <h2 className="font-rubik text-sm font-bold text-text1">Verification Backlog Pipeline</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border1 text-text3 font-bold bg-bg/50 uppercase tracking-wide text-[0.68rem]">
                    <th className="p-4">Listing ID</th>
                    <th className="p-4">Host Name</th>
                    <th className="p-4">Property Profile</th>
                    <th className="p-4">Price Rule</th>
                    <th className="p-4">System State</th>
                    <th className="p-4 text-right">Administrative Clearance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border1">
                  {listings.map((item) => (
                    <tr key={item.id} className="hover:bg-surface/30 transition-colors">
                      <td className="p-4 font-mono text-text3">{item.id}</td>
                      <td className="p-4 text-text1 font-medium">{item.host}</td>
                      <td className="p-4 text-text2">{item.type}</td>
                      <td className="p-4 text-text2 font-mono">{item.rate}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[0.65rem] font-semibold border ${
                          item.status === 'Approved' ? 'bg-green1/10 text-green1 border-green1/20' :
                          item.status === 'Pending' ? 'bg-amber1/10 text-amber1 border-amber1/20' :
                          'bg-red1/10 text-red1 border-red1/20'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        {item.status === 'Pending' ? (
                          <>
                            <button 
                              onClick={() => handleUpdateListingStatus(item.id, 'Approved')}
                              className="px-3 py-1 bg-green1 text-[#0a1a0a] rounded font-bold hover:bg-accent transition-all">
                              Approve
                            </button>
                            <button 
                              onClick={() => handleUpdateListingStatus(item.id, 'Rejected')}
                              className="px-3 py-1 bg-transparent border border-border2 hover:border-red1 hover:text-red1 text-text2 rounded transition-all">
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-text3 text-[0.7rem] font-light italic">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentTab === 'disputes' && (
          <div className="space-y-4">
            {disputes.map((ticket) => (
              <div key={ticket.id} className="bg-bg2 border border-border1 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red1"></div>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                  <div>
                    <span className="text-xs font-mono text-text3 block">{ticket.id}</span>
                    <h3 className="font-rubik text-base font-bold text-text1 mt-0.5">{ticket.reason}</h3>
                    <span className="text-[0.7rem] text-green1 bg-surface border border-border1 px-2 py-0.5 rounded inline-block mt-1">
                      Origin: {ticket.raisedBy}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[0.65rem] font-semibold border ${
                    ticket.status === 'Open' ? 'bg-red1/10 text-red1 border-red1/20' : 'bg-green1/10 text-green1 border-green1/20'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-text2 text-xs font-light leading-relaxed bg-bg/40 p-3 rounded border border-border1/5 mb-4">
                  {ticket.details}
                </p>
                {ticket.status === 'Open' && (
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleResolveDispute(ticket.id)}
                      className="px-4 py-1.5 bg-surface border border-border2 hover:border-green1 text-text2 hover:text-green1 font-medium text-xs rounded transition-all">
                      ✓ Mark as Settle Dispute
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}