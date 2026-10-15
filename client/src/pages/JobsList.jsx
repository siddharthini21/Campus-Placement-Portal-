import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, DollarSign, Building2 } from "lucide-react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState([]);
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    setMessage("");
    try {
      await API.post(`/jobs/${jobId}/apply`);
      setAppliedIds([...appliedIds, jobId]);
      setMessage("Application submitted!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not apply");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-[Fraunces] text-3xl text-black mb-1">
          {user?.role === "recruiter" ? "All job postings" : "Open positions"}
        </h1>
        <p className="text-gray-500 mb-8">
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"} available
        </p>

        {message && (
          <div className="bg-gray-100 text-black text-sm px-4 py-3 rounded-md mb-4 border border-gray-200">
            {message}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500">No jobs posted yet.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white border border-gray-300 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-[Fraunces] text-xl text-black">{job.title}</h2>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                      <Building2 size={14} /> {job.company}
                    </p>
                  </div>

                  {user?.role === "student" && (
                    <button
                      onClick={() => handleApply(job._id)}
                      disabled={appliedIds.includes(job._id)}
                      className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      {appliedIds.includes(job._id) ? "Applied" : "Apply"}
                    </button>
                  )}

                  {user?.role === "recruiter" && (
                    <Link
                      to={`/jobs/${job._id}/applicants`}
                      className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition-colors shrink-0"
                    >
                      View Applicants
                    </Link>
                  )}
                </div>

                <p className="text-gray-500 mt-4 text-sm">{job.description}</p>

                {(job.minCgpa > 0 || job.eligibleDepartments?.length > 0) && (
                  <p className="text-xs text-gray-500 mt-2">
                    Eligibility: {job.minCgpa > 0 && `Min CGPA ${job.minCgpa}`}
                    {job.minCgpa > 0 && job.eligibleDepartments?.length > 0 && " · "}
                    {job.eligibleDepartments?.length > 0 && job.eligibleDepartments.join(", ")}
                  </p>
                )}

                <div className="flex gap-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {job.location}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-1">
                      <DollarSign size={14} /> {job.salary}
                    </span>
                  )}
                  {job.deadline && (
                    <span>Apply by {new Date(job.deadline).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobsList;