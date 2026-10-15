import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Building2, MapPin, DollarSign } from "lucide-react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function PostJob() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    salary: "",
    minCgpa: "",
    eligibleDepartments: "",
    deadline: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const payload = {
        ...formData,
        minCgpa: formData.minCgpa ? parseFloat(formData.minCgpa) : 0,
        eligibleDepartments: formData.eligibleDepartments
          ? formData.eligibleDepartments.split(",").map((d) => d.trim()).filter(Boolean)
          : [],
      };
      await API.post("/jobs/create", payload);
      setSuccess("Job posted successfully!");
      setTimeout(() => navigate("/jobs"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 className="font-[Fraunces] text-3xl text-black mb-1">Post a new job</h1>
        <p className="text-gray-500 mb-8">Fill in the details for students to see.</p>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-md mb-4">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-md mb-4">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 border border-gray-300 rounded-lg p-6">
          <div>
            <label className="block text-sm text-black mb-1">Job title</label>
            <div className="relative">
              <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Software Engineer"
                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-black mb-1">Company</label>
            <div className="relative">
              <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="TechCorp"
                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-black mb-1">Location</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Chennai"
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-black mb-1">Salary</label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="6 LPA"
                  className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-black mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Role responsibilities, requirements..."
              className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-black mb-1">Minimum CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                name="minCgpa"
                value={formData.minCgpa}
                onChange={handleChange}
                placeholder="7.0"
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm text-black mb-1">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-black mb-1">
              Eligible departments (comma separated, leave blank for all)
            </label>
            <input
              type="text"
              name="eligibleDepartments"
              value={formData.eligibleDepartments}
              onChange={handleChange}
              placeholder="Computer Science, IT"
              className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-60"
          >
            {loading ? "Posting..." : "Post job"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;