import { useState } from "react";
import "../JobSearch.css";

function JobSearch({ setJobs }) {
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [experience, setExperience] = useState("");
  const [selectedCity, setSelectedCity] = useState("");


  const cityMapping = {
    "Bengaluru": 97,
    "Delhi /NCR": 9508,
    "Hyderabad": 17,
    "Pune": 139,
    "Mumbai": 134,
    "Chennai": 183,
    "Ahmedabad": 51,
    "Kolkata": 232,
    "Bhubaneswar": 155
  };


  const handleSearch = async () => {
  
    if (!jobTitle.trim()) {
      alert("Please enter a job title.");
      return;
    }
    setLoading(true);
  
    try {
      console.log(cityMapping[selectedCity]);
      const response = await fetch(`http://127.0.0.1:4061/api/scrape-jobs?jobTitle=${encodeURIComponent(jobTitle)}&experience=${encodeURIComponent(experience)}&cityTypeGid=${encodeURIComponent(selectedCity)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const result = await response.json();
      console.log("📡 API Response:", result);
  
      if (result.data) {
        setJobs(result.data); // ✅ Update job list
      } else {
        alert(result.message || "No jobs found!");
      }
    } catch (error) {
      console.error("❌ Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleShowAllJobs = async () => {
    setJobTitle(""); // Clear the search bar
    fetchJobs(""); // Fetch all jobs
    setExperience("");
    setSelectedCity("");
  };

  const fetchJobs = async () => {
    // setLoading(true);
    
    try {
      const response = await fetch(`http://127.0.0.1:4061/api/jobs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("📡 API Response:", result);

      if (result.data) {
        setJobs(result.data); // ✅ Update job list
      } else {
        alert(result.message || "No jobs found!");
      }
    } catch (error) {
      console.error("❌ Error fetching jobs:", error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="job-search-container">
      <h1 className="search-title">🔍 Search Jobs</h1>
      <input
        type="text"
        placeholder="Enter job title (e.g., React Developer)"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        className="input-field"
      />
      <select
  value={experience}
  onChange={(e) => setExperience(e.target.value)}
  className="filter-dropdown"
>



  <option value="">Select Experience</option>
  {[...Array(10)].map((_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1} years</option>
        ))}
</select>


<select
        value={selectedCity}
        onChange={(e) => {setSelectedCity(e.target.value)
        }}
        className="filter-dropdown"
      >
        <option value="">Select Location</option>
        {Object.keys(cityMapping).map((city) => (
          <option key={city} value={cityMapping[city]}>{city}</option>
          
        ))}
      </select>

      <div className="button-group">
      <button onClick={handleSearch} className="search-btn" disabled={loading}>
        {loading ? "Searching..." : "Search Jobs"}
      </button>
      <button onClick={handleShowAllJobs} className="search-btn" disabled={loading}>
        All Jobs
      </button>
      </div>
    </div>
  );
}

export default JobSearch;
