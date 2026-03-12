import React, { useState } from "react";
import { 
  FaUserCircle, FaEdit, FaTimes, FaCamera, 
  FaUserShield, FaCalendarAlt, FaVenusMars, 
  FaPhone, FaEnvelope, FaFingerprint, FaSave, FaCheckCircle, FaUserTag 
} from "react-icons/fa";
import { useAuth } from "../../api/auth";

function Header({ avatarUrl }) {
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Profile Data State
  const [profileData, setProfileData] = useState({
    username: user?.username || "Guest User",
    role: user?.role || "Student",
    email: user?.email || "user@ousl.lk",
    dob: "1998-05-20",
    gender: "Male",
    phone: "+94 71 234 5678",
    bio: "Passionate learner at OUSL. Focused on academic excellence and research in software engineering."
  });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Save with Validation
  const handleSave = () => {
   
    if (!profileData.email || !profileData.phone || !profileData.bio) {
        alert("Please fill in all required fields marked with *");
        return;
    }
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <header className="w-full h-20 bg-linear-to-r from-[#0c4187] to-[#070055] flex items-center justify-between px-8 py-3 shadow-2xl sticky top-0 z-40">
        {/* Left: Logo + Titles */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow">
          <img
            src="/src/assets/logoOusl.png"
            alt="OUSL Logo"
            className="w-8 h-8 object-contain"
          />
        </div>

        {/* Text */}
        <div className="leading-tight">
          <h1 className="text-white font-bold text-lg tracking-wide">
            OUSL Dispatch
          </h1>
          <p className="text-white/70 text-xs tracking-wide">
            Administration Panel
          </p>
        </div>
      </div>

        {/* Right: User Profile Trigger */}
        <div 
          onClick={() => setIsProfileOpen(true)} 
          className="group flex items-center gap-4 bg-white/10 hover:bg-white/15 p-1.5 pr-5 rounded-2xl cursor-pointer transition-all border border-white/10 backdrop-blur-md shadow-inner"
        >
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} className="w-10 h-10 rounded-xl border-2 border-indigo-400 group-hover:scale-105 transition-transform" alt="User" />
            ) : (
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center border-2 border-indigo-300 shadow-md">
                <FaUserCircle className="text-white text-2xl" />
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#092257] rounded-full shadow-lg"></span>
          </div>
          <div className="text-left">
            <p className="text-sm font-black text-white uppercase tracking-wide group-hover:text-indigo-200 transition-colors">{profileData.username}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-tighter shadow-sm ${profileData.role === 'Admin' ? 'bg-amber-400 text-amber-900' : 'bg-indigo-500 text-white'}`}>
              {profileData.role}
            </span>
          </div>
        </div>
      </header>

      {/* --- PROFILE PANEL --- */}
      <div className={`fixed inset-0 z-60 transition-all duration-500 ${isProfileOpen ? "visible" : "invisible"}`}>
        <div 
          onClick={() => { setIsProfileOpen(false); setIsEditing(false); }} 
          className={`absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity duration-500 ${isProfileOpen ? "opacity-100" : "opacity-0"}`} 
        />

        <div className={`absolute right-0 top-0 h-full w-full max-w-sm bg-[#FDFDFD] shadow-[-10px_0_40px_rgba(0,0,0,0.3)] transition-transform duration-500 transform flex flex-col ${isProfileOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          {/* Header Banner */}
          <div className="h-32 bg-[#0c4187] relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-linear-to-br from-indigo-900/50 to-transparent"></div>
            <button 
              onClick={() => { setIsProfileOpen(false); setIsEditing(false); }} 
              className="absolute top-5 right-5 p-2.5 bg-white/10 hover:bg-rose-500 text-white rounded-xl transition-all z-20 shadow-lg"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="px-8 -mt-12 z-10">
            <div className="flex flex-col items-center">
              <div className="relative group mb-3">
                <div className="w-28 h-28 bg-white rounded-4xl p-1.5 shadow-2xl border border-slate-100 overflow-hidden">
                  <div className="w-full h-full bg-slate-50 rounded-[1.7rem] flex items-center justify-center overflow-hidden">
                    {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" alt="User"/> : <FaUserCircle className="text-slate-200" size={80} />}
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 p-2.5 bg-indigo-600 text-white rounded-xl shadow-xl hover:scale-110 transition-all border-4 border-white">
                  <FaCamera size={14} />
                </button>
              </div>
              
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{profileData.username}</h2>
              <p className="text-indigo-600 font-extrabold text-xs uppercase tracking-[0.2em] mt-1">{profileData.role}</p>
              
              {showSuccess && (
                <div className="mt-2 flex items-center gap-2 text-emerald-600 text-[11px] font-black bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 animate-bounce">
                  <FaCheckCircle /> UPDATED SUCCESSFULLY
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 overflow-y-auto px-8 mt-6 pb-6 space-y-6">
            
            {/* Bio */}
            <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    Personal Bio <span className="text-rose-500">*</span>
                </span>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-indigo-600 text-[10px] font-black uppercase hover:underline">
                    <FaEdit /> Edit Profile
                  </button>
                )}
              </div>
              {isEditing ? (
                <textarea 
                  name="bio" 
                  required
                  placeholder="Tell us about yourself..."
                  value={profileData.bio} 
                  onChange={handleChange} 
                  className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-xs font-bold text-slate-600 focus:border-indigo-500 outline-none transition-all h-24 resize-none shadow-inner" 
                />
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed font-bold italic">"{profileData.bio}"</p>
              )}
            </div>

            {/* Information Grid */}
            <div className="space-y-4">
              <DetailBox icon={<FaEnvelope />} label="Email Address" name="email" value={profileData.email} isEditing={isEditing} onChange={handleChange} required />
              <DetailBox icon={<FaCalendarAlt />} label="Birth Date" name="dob" value={profileData.dob} isEditing={isEditing} onChange={handleChange} type="date" required />
              <DetailBox icon={<FaVenusMars />} label="Gender" name="gender" value={profileData.gender} isEditing={isEditing} onChange={handleChange} isSelect options={["Male", "Female", "Other"]} required />
              <DetailBox icon={<FaUserTag />} label="Access Role" name="role" value={profileData.role} isEditing={isEditing} onChange={handleChange} isSelect options={["Admin", "Staff", "Student"]} required />
              <DetailBox icon={<FaPhone />} label="Phone Contact" name="phone" value={profileData.phone} isEditing={isEditing} onChange={handleChange} required />
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-8 bg-white border-t border-slate-50">
            {isEditing ? (
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="flex-1 py-4 bg-slate-100 text-slate-500 text-xs font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className="flex-2 py-4 bg-indigo-600 text-white text-xs font-black rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all active:scale-95 uppercase tracking-widest"
                >
                  <FaSave /> Save Changes
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsProfileOpen(false)} 
                className="w-full py-4 bg-slate-900 text-white text-xs font-black rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 uppercase tracking-widest"
              >
                Close Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Reusable Detail Box Component
const DetailBox = ({ icon, label, name, value, isEditing, onChange, type = "text", isSelect = false, options = [], required = false }) => (
  <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100 shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {isEditing ? (
        isSelect ? (
          <select 
            name={name} 
            value={value} 
            required={required}
            onChange={onChange} 
            className="w-full bg-transparent border-b border-indigo-200 focus:border-indigo-600 outline-none text-xs font-black text-slate-700 py-1 transition-all appearance-none cursor-pointer"
          >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input 
            type={type} 
            name={name} 
            required={required}
            placeholder={`Enter ${label.toLowerCase()}`}
            value={value} 
            onChange={onChange} 
            className="w-full bg-transparent border-b border-indigo-200 focus:border-indigo-600 outline-none text-xs font-black text-slate-700 py-1 transition-all" 
          />
        )
      ) : (
        <p className="text-xs font-black text-slate-800 truncate">{value}</p>
      )}
    </div>
  </div>
);

export default Header;