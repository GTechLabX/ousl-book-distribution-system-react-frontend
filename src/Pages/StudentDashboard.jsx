import React from 'react';
import { 
  Bell, 
  BookOpen, 
  MapPin, 
  Info, 
  CheckCircle, 
  MessageSquare,
  Calendar
} from 'lucide-react';
import { useAuth } from "../api/auth";

const StudentDashboard = () => {
  const { user } = useAuth();

  // Mock messages for student notifications
  const notifications = [
    {
      id: 1,
      type: 'important',
      title: 'Material Collection Notice',
      message: 'Materials for the Semester 1 are now available at your registered Regional Center.',
      date: 'Today',
      icon: <Bell className="text-amber-600" />,
      bg: 'bg-amber-50'
    },
    {
      id: 2,
      type: 'info',
      title: 'Regional Center Update',
      message: 'Colombo Regional Center will be closed on Poya Day.',
      date: '2 days ago',
      icon: <Info className="text-blue-600" />,
      bg: 'bg-blue-50'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      {/* Welcome Header */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Ayubowan, {user?.student_name || 'Student'}!
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Manage your book distributions and track your course materials here.
          </p>
        </div>
        
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card & Info */}
        <div className="space-y-6">
          {/* <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MapPin className="text-indigo-600" size={20} /> My Center
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Regional Center</label>
                <p className="text-lg font-semibold text-slate-800">{user?.center || 'Colombo Regional Center'}</p>
              </div>
              <div className="pt-4 border-t border-slate-50">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">District</label>
                <p className="text-lg font-semibold text-slate-800">{user?.district || 'Colombo'}</p>
              </div>
            </div>
          </div> */}

          <div className="bg-indigo-900 rounded-3xl p-8 shadow-lg text-white">
            <h3 className="text-lg font-bold mb-2">Need Help?</h3>
            <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
              If you have any issues with book collection, please visit the help desk at your regional center.
            </p>
            <button className="w-full py-3 bg-white text-indigo-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors">
              <MessageSquare size={18} /> Contact Support
            </button>
          </div>
        </div>

        {/* Message & Notifications Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                Latest Announcements
              </h2>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase">
                {notifications.length} New
              </span>
            </div>

            <div className="space-y-4">
              {notifications.map((note) => (
                <div 
                  key={note.id} 
                  className={`flex gap-5 p-6 rounded-2xl transition-all hover:scale-[1.01] ${note.bg} border border-transparent hover:border-slate-100`}
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    {note.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 text-lg">{note.title}</h4>
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <Calendar size={12} /> {note.date}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-2 leading-relaxed">
                      {note.message}
                    </p>
                  </div>
                </div>
              ))}

              {/* Status Message */}
              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex items-center gap-4">
                <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">System Status</h4>
                  <p className="text-slate-600 text-sm font-medium italic">
                    Your QR Code is active. Please present it at the counter for material collection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;