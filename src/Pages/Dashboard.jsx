import React, { useState, useEffect } from 'react';
import { BarChart3, Users, BookOpen, Clock, AlertCircle } from 'lucide-react';
import api from "../api/axios"; 
import { useAuth } from "../api/auth"; 

const Dashboard = () => {
  const { user } = useAuth(); 
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    register_student_count: 0,
    active_reservation_count: 0,
    available_book_count: 0,
    total_book_issued: 0,
    latest_received_books: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Match the value from your Django Role choices (All Caps)
        const isSuperAdmin = user?.role === "SUPERADMIN";
        
        // Default endpoint for SUPERADMIN
        let endpoint = "/dashboard/";

        // If NOT Superadmin, append the UUID/Center ID
        if (!isSuperAdmin) {
            const centerId = user?.center_uuid || user?.center_id || user?.uuid;
            if (centerId) {
                endpoint = `/dashboard/${centerId}/`;
            }
        }

        console.log("Fetching for Role:", user?.role, "-> Endpoint:", endpoint);

        const response = await api.get(endpoint);
        
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Helper to extract student name
  const getStudentName = (str) => {
    if (!str) return "Unknown";
    return str.includes(': ') ? str.split(': ')[1] : str;
  };

  const stats = [
    { title: 'Total Books Issued', value: data.total_book_issued, icon: <BookOpen className="text-blue-600" />, change: 'Total', positive: true },
    { title: 'Registered Students', value: data.register_student_count, icon: <Users className="text-purple-600" />, change: 'Active', positive: true },
    { title: 'Active Reservations', value: data.active_reservation_count, icon: <Clock className="text-emerald-600" />, change: 'Pending', positive: true },
    { title: 'Available Book Stock', value: data.available_book_count, icon: <BarChart3 className="text-orange-600" />, change: 'In Store', positive: true },
  ];

  const weeklyData = [0.1, 0.25, 0.15, 0.3, 0.2, 0.1, 0.05]; 
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.role === "SUPERADMIN" ? "OUSL Central Dashboard" : "Regional Center Dashboard"}
        </h1>
        <p className="text-gray-500">
            Welcome back, {user?.username || 'Admin'}! View current statistics and activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graph Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Dispatch Volume</h2>
          <div className="w-full h-64 bg-gray-50/50 rounded-lg flex items-end justify-between px-6 pb-4">
            {weeklyData.map((weight, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-full group">
                <div 
                  className={`w-10 rounded-t-md transition-all duration-500 ${i === 3 ? 'bg-blue-600' : 'bg-blue-200 group-hover:bg-blue-300'}`}
                  style={{ height: `${(data.total_book_issued * weight * 0.5) + 10}px`, minHeight: '10px' }}
                ></div>
                <span className="text-xs font-medium text-gray-400 uppercase">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Activity Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Latest Transactions</h2>
          <div className="space-y-6">
            {data.latest_received_books.length > 0 ? (
              data.latest_received_books.map((item) => (
                <div key={item.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs uppercase">
                      {getStudentName(item.student).charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{getStudentName(item.student)}</p>
                      <p className="text-[10px] text-gray-500 uppercase">{item.book}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-semibold text-gray-900">#{item.id}</span>
                    <span className={`text-[10px] font-bold ${item.is_received ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {item.is_received ? 'COLLECTED' : 'PENDING'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-40">
                <AlertCircle size={40} />
                <p className="text-sm mt-2 font-medium">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;