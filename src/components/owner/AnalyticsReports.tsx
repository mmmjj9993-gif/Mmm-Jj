import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  UtensilsCrossed, 
  Download, 
  Bed, 
  Percent 
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

export const AnalyticsReports: React.FC = () => {
  const { bookings, foodOrders, rooms } = useHotel();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  // KPI Calculations
  const validBookings = bookings.filter(b => b.bookingStatus !== 'Cancelled');
  const totalRoomRevenue = validBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalFoodRevenue = foodOrders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const grossTotalRevenue = totalRoomRevenue + totalFoodRevenue;

  const totalNights = validBookings.reduce((sum, b) => sum + b.numberOfNights, 0);
  const averageDailyRate = totalNights > 0 ? totalRoomRevenue / totalNights : 0;
  
  // Occupancy rate approx (active bookings / total rooms)
  const activeOccupiedRooms = bookings.filter(b => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked-in').length;
  const occupancyPercentage = rooms.length > 0 ? Math.min(100, Math.round((activeOccupiedRooms / rooms.length) * 100)) : 0;

  // Chart 1: Revenue by month/day
  const revenueTrendData = [
    { name: 'Mon', rooms: 620, food: 140, total: 760 },
    { name: 'Tue', rooms: 780, food: 210, total: 990 },
    { name: 'Wed', rooms: 890, food: 230, total: 1120 },
    { name: 'Thu', rooms: 1150, food: 310, total: 1460 },
    { name: 'Fri', rooms: 1680, food: 490, total: 2170 },
    { name: 'Sat', rooms: 2100, food: 650, total: 2750 },
    { name: 'Sun', rooms: 1850, food: 540, total: 2390 }
  ];

  // Chart 2: Category share
  const categoryCounts: { [key: string]: number } = {};
  bookings.forEach(b => {
    categoryCounts[b.roomCategory] = (categoryCounts[b.roomCategory] || 0) + 1;
  });

  const categoryPieData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    value: categoryCounts[cat]
  }));

  const COLORS = ['#b45309', '#0d9488', '#4f46e5', '#e11d48'];

  // Chart 3: Food sales breakdown
  const foodCategoryData = [
    { category: 'Breakfast', sales: 480 },
    { category: 'Main Course', sales: 820 },
    { category: 'Beverages', sales: 340 },
    { category: 'Starters', sales: 290 },
    { category: 'Desserts', sales: 210 }
  ];

  const handleExportReport = () => {
    const reportText = `GRAND HORIZON HOTEL - FINANCIAL & OCCUPANCY PERFORMANCE REPORT\n` +
      `Generated: ${new Date().toLocaleString()}\n` +
      `--------------------------------------------------\n` +
      `Gross Hotel Revenue: $${grossTotalRevenue.toFixed(2)}\n` +
      `Room Booking Revenue: $${totalRoomRevenue.toFixed(2)}\n` +
      `Cafeteria & Dining Revenue: $${totalFoodRevenue.toFixed(2)}\n` +
      `Total Completed Bookings: ${validBookings.length}\n` +
      `Average Daily Rate (ADR): $${averageDailyRate.toFixed(2)}\n` +
      `Current Occupancy: ${occupancyPercentage}%\n` +
      `Active Room Inventory: ${rooms.length} Suites\n`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hotel-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
            Reports & Business Intelligence
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key operational metrics, revenue forecasting, food order volume, and channel occupancy.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-semibold">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-lg transition ${timeRange === '7d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-lg transition ${timeRange === '30d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1 rounded-lg transition ${timeRange === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              All Time
            </button>
          </div>

          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Summary</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              Total Revenue
            </span>
            <span className="font-serif-luxury text-2xl font-bold text-slate-900">
              ${grossTotalRevenue.toFixed(2)}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
              +$790 vs last week
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              Occupancy Rate
            </span>
            <span className="font-serif-luxury text-2xl font-bold text-slate-900">
              {occupancyPercentage}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {activeOccupiedRooms} of {rooms.length} Suites occupied
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              Average Daily Rate (ADR)
            </span>
            <span className="font-serif-luxury text-2xl font-bold text-slate-900">
              ${averageDailyRate.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Per occupied room night
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center flex-shrink-0">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              Cafeteria Revenue
            </span>
            <span className="font-serif-luxury text-2xl font-bold text-slate-900">
              ${totalFoodRevenue.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {foodOrders.length} Room service orders
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 cols: Revenue Trend Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif-luxury font-bold text-lg text-slate-900">
                Revenue Generation Trend
              </h4>
              <p className="text-xs text-slate-400">
                Daily comparison between Suite Bookings vs Dining Room Service
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-semibold">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
                <span>Room Stays</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block"></span>
                <span>Cafeteria</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRooms" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b45309" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#b45309" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorFood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  formatter={(value: any) => [`$${value}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="rooms" name="Rooms ($)" stroke="#b45309" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRooms)" />
                <Area type="monotone" dataKey="food" name="Dining ($)" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFood)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 4 cols: Room Category Share Pie */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="font-serif-luxury font-bold text-lg text-slate-900">
              Demand by Category
            </h4>
            <p className="text-xs text-slate-400">
              Booking distribution across room tiers
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {categoryPieData.length === 0 ? (
              <p className="text-xs text-slate-400">No category data</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend labels */}
          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
            {categoryPieData.map((c, i) => (
              <div key={i} className="flex justify-between items-center text-slate-600">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                  <span className="truncate max-w-[140px]">{c.name}</span>
                </span>
                <span className="font-bold text-slate-800">{c.value} Bookings</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Food Category Bar Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <h4 className="font-serif-luxury font-bold text-lg text-slate-900">
          Kitchen & Cafeteria Category Sales Breakdown ($)
        </h4>
        <p className="text-xs text-slate-400">
          Top performing culinary categories ordered for in-room dining
        </p>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={foodCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip 
                formatter={(val: any) => [`$${val}`, 'Revenue']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="sales" fill="#b45309" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
