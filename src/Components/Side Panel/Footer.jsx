function Footer({ onLogout }) {
  return (
    <div className="px-4 py-4 border-t border-white/20 text-center">
      <button
        onClick={onLogout}
        className="w-full bg-white text-[#0c4187] py-2 rounded-lg
                   font-semibold hover:bg-gray-200 transition shadow"
      >
        Log Out
      </button>

      <p className="text-white/70 text-xs mt-3">Version 1.0</p>
    </div>
  );
}

export default Footer;
