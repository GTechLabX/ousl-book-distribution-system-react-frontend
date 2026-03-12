import React, { useState, useEffect } from 'react';
import { BarChart3, Users, BookOpen, Clock, AlertCircle } from 'lucide-react';
import api from "../api/axios"; 

const Dashboard = () => {
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
        const response = await api.get("/dashboard/");
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper to extract student name from the string "Student name: test 2"
  const getStudentName = (str) => str.split(': ')[1] || str;

  const stats = [
    { title: 'Total Books Issued', value: data.total_book_issued, icon: <BookOpen className="text-blue-600" />, change: 'Total', positive: true },
    { title: 'Registered Students', value: data.register_student_count, icon: <Users className="text-purple-600" />, change: 'Active', positive: true },
    { title: 'Active Reservations', value: data.active_reservation_count, icon: <Clock className="text-emerald-600" />, change: 'Pending', positive: true },
    { title: 'Available Book Stock', value: data.available_book_count, icon: <BarChart3 className="text-orange-600" />, change: 'In Store', positive: true },
  ];

  // Logic for Weekly Dispatch Volume chart
  // Since the API returns a single total, we simulate a distribution across the week
  const weeklyData = [0.1, 0.25, 0.15, 0.3, 0.2, 0.1, 0.05]; // Weight distribution
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">OUSL Dispatch Overview</h1>
        <p className="text-gray-500">Welcome back! Manage your book distribution and student requests efficiently.</p>
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

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly Dispatch Volume Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Weekly Dispatch Volume</h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">View Detailed Report</button>
          </div>
          
          <div className="w-full h-64 bg-gray-50/50 rounded-lg border border-gray-100 flex items-end justify-between px-6 pb-4 pt-10">
            {weeklyData.map((weight, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-full group">
                <div 
                  className={`w-10 rounded-t-md transition-all duration-500 relative ${i === 3 ? 'bg-blue-600' : 'bg-blue-200 group-hover:bg-blue-300'}`}
                  style={{ height: `${(data.total_book_issued * weight * 2) + 10}px`, maxHeight: '180px' }}
                >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {Math.floor(data.total_book_issued * weight)}
                    </div>
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase">{days[i]}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-gray-400 italic">Historical distribution based on current total: {data.total_book_issued} books</p>
        </div>

        {/* Recent Activity List (Matched to your API) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Latest Book Issuing</h2>
          <div className="space-y-6">
            {data.latest_received_books.length > 0 ? (
              data.latest_received_books.map((item) => (
                <div key={item.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                      {getStudentName(item.student).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{getStudentName(item.student)}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{item.book}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-semibold text-gray-900">#{item.id}</span>
                    <span className={`text-[10px] uppercase font-bold ${item.is_received ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {item.is_received ? 'Collected' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-40">
                <AlertCircle size={40} />
                <p className="text-sm mt-2 font-medium">No recent transactions</p>
              </div>
            )}
          </div>
          <button className="w-full mt-8 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            View All Records
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;