import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Download, 
  Eye, 
  X, 
  DollarSign,
  UserCheck
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { Customer, Booking } from '../../types';

export const CustomersManager: React.FC = () => {
  const { customers, bookings } = useHotel();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Compute spend and stats for each customer
  const enrichedCustomers = customers.map(c => {
    const custBookings = bookings.filter(b => 
      b.customerId === c.id || 
      b.customerEmail.toLowerCase() === c.email.toLowerCase() ||
      b.customerPhone === c.phone
    );
    const totalSpent = custBookings.reduce((sum, b) => b.bookingStatus !== 'Cancelled' ? sum + b.totalAmount : sum, 0);
    return {
      ...c,
      bookingsCount: custBookings.length,
      totalSpent,
      history: custBookings
    };
  });

  const filtered = enrichedCustomers.filter(c => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.address && c.address.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Name,Email,Phone,Address,Total Bookings,Total Spent ($),Created At'];
    const rows = filtered.map(c => 
      `"${c.name}","${c.email}","${c.phone}","${c.address || ''}",${c.bookingsCount},${c.totalSpent.toFixed(2)},"${c.createdAt}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hotel-customers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
            Guest CRM & Customer Directory
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered hotel patrons, reservation history, and lifetime guest value metrics.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex justify-between items-center text-xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, phone, or city..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <span className="text-slate-400 text-xs font-medium">
          Showing {filtered.length} of {customers.length} Guests
        </span>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Location</th>
                <th className="p-4">Total Stays</th>
                <th className="p-4">Lifetime Spend</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No customers found matching search query.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4 font-semibold text-slate-900">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold block">{c.name}</span>
                          <span className="text-[10px] text-slate-400">Member since {new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="flex items-center space-x-1.5 text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.email}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.phone}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {c.address || 'Not specified'}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900">{c.bookingsCount}</span>
                      <span className="text-slate-400 text-[11px] ml-1">bookings</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-amber-800 text-sm">${c.totalSpent.toFixed(2)}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px] transition inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>History</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Booking History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-serif-luxury font-bold text-xl text-slate-900">
                  {selectedCustomer.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedCustomer.email} • {selectedCustomer.phone}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Reservation History ({bookings.filter(b => b.customerEmail.toLowerCase() === selectedCustomer.email.toLowerCase() || b.customerId === selectedCustomer.id).length})
              </h5>

              {bookings.filter(b => b.customerEmail.toLowerCase() === selectedCustomer.email.toLowerCase() || b.customerId === selectedCustomer.id).map(b => (
                <div key={b.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-slate-800">{b.id}</span>
                    <span className="text-slate-600 block mt-0.5">{b.roomName} (Room {b.roomNumber})</span>
                    <span className="text-[11px] text-slate-400">{b.checkIn} → {b.checkOut} ({b.numberOfNights} nights)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-800 text-sm block">${b.totalAmount.toFixed(2)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.bookingStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      b.bookingStatus === 'Checked-in' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {b.bookingStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
