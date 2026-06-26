import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CmdBox from "../components/CmdBox";
import { submitDesignApplication } from "../api/backend";
import { getCopyPrefix } from "../utils/getCopyPrefix";

function buildHashCommand({ name, email, phone, country }) {
  const payload = `name=${name}&email=${email}&phone=${phone}&country=${country}`;
  return `powershell -NoProfile -Command "$s='${payload}'; [BitConverter]::ToString([Security.Cryptography.SHA256]::Create().ComputeHash([Text.Encoding]::UTF8.GetBytes($s))).Replace('-','').ToLower()"`;
}

export default function Application() {
  const navigate = useNavigate();
  const copyPrefix = useMemo(() => getCopyPrefix(), []);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
  });
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setStatus(null);
  };

  const handleSend = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setStatus({ type: "error", message: "Please fill in: name, email" });
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      await submitDesignApplication(
        form.name.trim(),
        form.email.trim(),
        !!hash.trim()
      );
      setStatus({ type: "success", message: "Application sent successfully!" });
    } catch {
      setStatus({
        type: "error",
        message: "Could not send application. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  const hashCommand = buildHashCommand(form);

  return (
    <div className="application-page">
      <div className="application-card">
        <header className="application-header">
          <button type="button" className="application-back" onClick={() => navigate("/")}>
            ← Back to jobs
          </button>
          <h1 className="application-title">
            Job <span>Application</span>
          </h1>
          <p className="application-subtitle">
            Enter your details, copy the generated command into Windows CMD, then
            paste the hash below to submit.
          </p>
        </header>

        <aside className="application-info">
          <h2 className="application-info-title">Why do we ask you to use CMD?</h2>
          <p className="application-info-lead">
            For your privacy, our company does <strong>not</strong> store your name,
            email, phone, or country as plain readable text. Instead, we save your
            application as a <strong>hash</strong> — a secure, one-way fingerprint
            of your details.
          </p>
          <ol className="application-info-list">
            <li>
              <strong>You enter your details</strong> — the form builds a command
              that includes your information.
            </li>
            <li>
              <strong>You run it in CMD on your own computer</strong> — the hash is
              created locally on your machine. Your raw details are not sent to us
              during this step.
            </li>
            <li>
              <strong>You paste only the hash and click Send</strong> — we receive
              the fingerprint, not your original text. We use it to process and
              match your application securely.
            </li>
          </ol>
          <p className="application-info-note">
            <strong>What is a hash?</strong> It looks like a long code (for example,
            <code>a3f5b2…</code>). The same information always produces the same
            hash, but the hash cannot be turned back into your personal details.
            This is a standard way to protect sensitive data.
          </p>
        </aside>

        <div className="application-grid">
          <section className="application-section">
            <p className="application-section-title">Step 1</p>
            <h2 className="application-step">Your details</h2>

            <div className="application-fields">
              <input
                className="application-input"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
              />
              <input
                className="application-input"
                name="email"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
              <input
                className="application-input"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
              />
              <input
                className="application-input"
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
              />
            </div>
          </section>

          <section className="application-section">
            <p className="application-section-title">Step 2 & 3</p>
            <h2 className="application-step">Hash verification</h2>
            <p className="application-hint">
              The command updates as you type. Copy it, run it in CMD on your
              computer, then paste the hash it prints here. Only the hash is
              submitted — not your original details.
            </p>

            <div className="application-cmd-wrap">
              <CmdBox value={hashCommand} copyPrefix={copyPrefix} />
            </div>

            <label className="application-label" htmlFor="hash-input">
              Hash
            </label>
            <input
              id="hash-input"
              className="application-input"
              placeholder="Paste hash from CMD here"
              value={hash}
              onChange={(e) => {
                setHash(e.target.value);
                setStatus(null);
              }}
            />

            <button
              type="button"
              className="application-send"
              onClick={handleSend}
              disabled={sending}
            >
              {sending ? "Sending..." : "Send application"}
            </button>

            {status && (
              <p className={`application-status ${status.type}`}>{status.message}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
