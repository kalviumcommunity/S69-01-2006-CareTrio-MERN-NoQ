"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // Hard refresh to clear state
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          N
        </div>
        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          NoQ
        </span>
      </Link>

      {/* Only show profile if user is logged in */}
      {user ? (
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-xl transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">
                Dr. {user.name?.split(" ")[0] || "Doctor"}
              </p>
              <p className="text-xs text-gray-500">General Physician</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white shadow-md">
              <User size={20} />
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-4">
             <Link href="/login" className="text-lg font-semibold text-gray-600 hover:text-blue-600 transition">Login</Link>
             <Link href="/signup" className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition">Sign Up</Link>
        </div>
      )}
    </nav>
  );
}