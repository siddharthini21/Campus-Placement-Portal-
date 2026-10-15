import { useEffect, useState } from "react";
import { Building2, MapPin } from "lucide-react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/jobs/my-applications")
      .then((res) => setApplications(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = {
    applied: "bg-gray-100 text-gray-600",
    shortlisted: "bg-blue-50 text-blue-700",
    interview: "bg-yellow-50 text-yellow-700",
    selected: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-[Fraunces] text-3xl text-black mb-1">My applications</h1>
        <p className="text-gray-500 mb-8">Track the status of jobs you've applied to.</p>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : applications.length === 0 ? (
          <p className="text-gray-500">You haven't applied to any jobs yet.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-white border border-gray-300 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-[Fraunces] text-lg text-black">{app.job?.title}</h2>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                      <Building2 size={14} /> {app.job?.company}
                    </p>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <MapPin size={14} /> {app.job?.location}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full capitalize ${statusColor[app.status]}`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyApplications;