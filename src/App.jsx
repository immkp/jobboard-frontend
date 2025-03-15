import { useEffect, useState } from "react";
import JobSearch from "./components/JobSearch";

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [jobsPerPage] = useState(12); // Jobs per page

  useEffect(() => {
    let isMounted = true;
    fetchJobs(0, isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchJobs = async (retryCount = 0, isMounted) => {
    try {
      const response = await fetch("https://jobboard-backend-d39t.onrender.com/api/jobs");
      const result = await response.json();

      if (result.data.length > 0) {
        if (isMounted) {
          setJobs(result.data);
          setLoading(false);
        }
      } else if (retryCount < 3) {
        setTimeout(() => fetchJobs(retryCount + 1, isMounted), 2000);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  // Get current jobs
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers
  const pageNumbers = [];
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Display only a subset of page numbers (e.g., 1 2 3 4 5)
  const maxPageButtons = 5; // Number of page buttons to show
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  const visiblePageNumbers = pageNumbers.slice(startPage - 1, endPage);

  return (
    <>
      <JobSearch setJobs={setJobs} />
      <div className="wrapper">
        <div className="container">
          <h1 className="title">🚀 Job Board</h1>
          {loading ? (
            <p className="loading-text">Loading jobs...</p>
          ) : (
            <>
              <div className="job-list">
                {currentJobs.map((job) => (
                  <div key={job._id} className="job-card">
                    <div className="job-header">
                      <h2 className="job-title">{job.title}</h2>
                      <p className="company">{job.company}</p>
                    </div>
                    <p className="location">
                      <i className="fas fa-map-marker-alt"></i> {job.location}
                    </p>
                    <p className="experience">
                      <i className="fas fa-briefcase"></i> Experience: {job.experience}
                    </p>
                    <a
                      href={job.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apply-btn"
                    >
                      Apply Now
                    </a>
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                {visiblePageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`pagination-btn ${
                      currentPage === number ? "active" : ""
                    }`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;