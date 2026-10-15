import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white text-black px-8 py-4 flex justify-between items-center border-b border-black/10">
      <div className="flex items-center gap-2">
        <GraduationCap size={22} className="text-black" />
        <Link to="/dashboard" className="font-[Fraunces] text-xl text-black">
          Campus Placements
        </Link>
      </div>

      <div className="flex items-center gap-6 text-sm">
        {user?.role === "admin" && (
          <Link to="/admin" className="hover:text-black transition-colors text-black">
            Admin Panel
          </Link>
        )}

        {user?.role === "recruiter" && (
          <>
            <Link to="/post-job" className="hover:text-black transition-colors text-black">
              Post a Job
            </Link>
            <Link to="/jobs" className="hover:text-black transition-colors text-black">
              My Postings
            </Link>
          </>
        )}

        {user?.role === "student" && (
          <>
            <Link to="/jobs" className="hover:text-black transition-colors text-black">
              Browse Jobs
            </Link>
            <Link to="/my-applications" className="hover:text-black transition-colors text-black">
              My Applications
            </Link>
            <Link to="/profile" className="hover:text-black transition-colors text-black">
              Profile
            </Link>
            <Link to="/upload-resume" className="hover:text-black transition-colors text-black">
              Resume
            </Link>
          </>
        )}

        <button
          onClick={handleLogout}
          className="bg-black text-white hover:bg-black/90 px-4 py-2 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;