import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Briefcase, FileCheck, Award } from "lucide-react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/jobs/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const icons = [Briefcase, FileCheck, Award];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-[Fraunces] text-lg">
            {initials}
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm capitalize">{user?.role} account</p>
            <h1 className="font-[Fraunces] text-2xl text-black">{user?.name}</h1>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 mb-8">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stats.map((s, i) => {
              const Icon = icons[i] || Briefcase;
              return (
                <div key={s.label} className="bg-white border border-gray-300 rounded-lg p-5">
                  <Icon size={20} className="text-black mb-3" />
                  <p className="text-2xl font-[Fraunces] text-black">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <p className="text-sm text-gray-500 mb-1">Email</p>
          <p className="text-black font-medium">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;