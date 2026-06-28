import { useLocation, useNavigate } from "react-router-dom";

export default function ApplicationSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const name = state?.name?.trim();

  return (
    <div className="application-page">
      <div className="application-card application-success-card panel-enter-left">
        <div className="application-success-icon" aria-hidden="true">
          ✓
        </div>

        <h1 className="application-success-title">
          Congratulations{name ? `, ${name}` : ""}!
        </h1>

        <p className="application-success-lead">
          Your application has been submitted successfully.
        </p>

        <div className="application-success-message">
          <p>
            Thank you for applying to <strong>Tatum</strong>. We have received
            your details securely and will begin scanning your information shortly.
          </p>
          <p>
            Our hiring team will review your profile and{" "}
            <strong>contact you by email</strong> once verification is complete.
            Please keep an eye on your inbox over the next few days.
          </p>
        </div>

        <ul className="application-success-steps">
          <li>Application received</li>
          <li>Information verification in progress</li>
          <li>We will inform you about the next steps</li>
        </ul>

        <button
          type="button"
          className="application-send application-success-btn"
          onClick={() => navigate("/")}
        >
          Back to job listings
        </button>
      </div>
    </div>
  );
}
