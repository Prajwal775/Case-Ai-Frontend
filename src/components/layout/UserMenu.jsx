import { useState, useRef, useEffect } from "react";
import { LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";

const UserMenu = () => {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Avatar Button */}
      <Button
        variant="outline"
        onClick={() => setOpen(!open)}
        className="rounded-full px-3 py-2 shadow-sm hover:shadow-md transition"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
          U
        </div>
      </Button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-48 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden z-50">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
