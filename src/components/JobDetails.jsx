import { useNavigate } from "react-router-dom";

export default function JobDetails({ job }) {
  const navigate = useNavigate();

  const handleApply = () => {
    navigate("/application");
  };

  if (!job) {
    return (
      <div className="job-detail job-detail-empty">
        <p>Select a job to view details</p>
      </div>
    );
  }

  return (
    <div className="job-detail">
      <div className="job-detail-content">
        <p className="detail-eyebrow">Open position</p>
        <h2 className="detail-title">{job.title}</h2>
        <p className="detail-location">{job.location}</p>

        <div className="detail-tags">
          <span>{job.type}</span>
          <span>{job.experience}</span>
          <span className="detail-tag-salary">{job.salary}</span>
        </div>

        <hr className="divider" />

        <h4 className="section-title">About the role</h4>
        <p className="description">{job.description}</p>
      </div>

      <div className="job-detail-footer">
        <p className="apply-note">
          Applications are verified with a secure local hash — your details stay
          private.
        </p>
        <button type="button" className="apply-btn" onClick={handleApply}>
          Apply Now
        </button>
      </div>
    </div>
  );
}
