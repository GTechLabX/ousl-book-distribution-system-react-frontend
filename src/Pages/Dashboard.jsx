import React from 'react';
import { BarChart3, Users, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // Sample data for the stats cards
  const stats = [
    { title: 'Total Revenue', value: '$45,231', icon: <DollarSign className="text-blue-600" />, change: '+12.5%', positive: true },
    { title: 'Active Users', value: '2,405', icon: <Users className="text-purple-600" />, change: '+3.2%', positive: true },
    { title: 'Sales Performance', value: '89%', icon: <TrendingUp className="text-emerald-600" />, change: '-2.1%', positive: false },
    { title: 'Avg. Order Value', value: '$152', icon: <BarChart3 className="text-orange-600" />, change: '+4.3%', positive: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Executive Overview</h1>
        <p className="text-gray-500">Welcome back! Here’s what’s happening with your projects today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
              <span className={`text-sm font-medium ${stat.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Large Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Growth</h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">View Report</button>
          </div>
          <div className="w-full h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
            <p className="text-gray-400 italic text-sm">[Insert Chart Component Here]</p>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Transactions</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                    JD
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-500">2 mins ago</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900">+$250.00</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">
            See All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;