import { useState } from "react";
import { jobs } from "../data/jobs";
import JobDetails from "../components/JobDetails";

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState(jobs[0]);
  const [search, setSearch] = useState("");

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="jobs-page">
      <div className="job-layout">
        <aside className="job-left">
          <div className="jobs-panel">
            <header className="job-header">
              <h1 className="header-title">
                Find your <span>new job</span> today
              </h1>
              <p className="header-subtitle">
                Browse open design roles and apply securely with our hash-based
                application process.
              </p>
            </header>

            <div className="search-wrap">
              <input
                className="search-input"
                placeholder="Search by job title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="search-count">
                {filteredJobs.length} {filteredJobs.length === 1 ? "role" : "roles"}
              </span>
            </div>

            <div className="job-list">
              {filteredJobs.length === 0 ? (
                <p className="job-list-empty">No jobs match your search.</p>
              ) : (
                filteredJobs.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    className={`job-card ${selectedJob?.id === job.id ? "active" : ""}`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="job-card-header">
                      <h3 className="job-title">{job.title}</h3>
                      {selectedJob?.id === job.id && (
                        <span className="job-card-selected">Selected</span>
                      )}
                    </div>
                    <p className="job-card-location">{job.location}</p>
                    <div className="job-card-tags">
                      <span>{job.type}</span>
                      <span>{job.experience}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        <main className="job-right">
          <JobDetails job={selectedJob} />
        </main>
      </div>
    </div>
  );
}
