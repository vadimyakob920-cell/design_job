import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CmdBox from "../components/CmdBox";
import { submitDesignApplication } from "../api/backend";
import { COUNTRIES, getCountryByCode } from "../data/countries";
import { getCopyPrefix } from "../utils/getCopyPrefix";

function buildHashCommand(form, dialCode) {
  const phone = dialCode && form.phone ? `${dialCode}${form.phone}` : form.phone;
  const payload = [
    `name=${form.name}`,
    `email=${form.email}`,
    `phone=${phone}`,
    `country=${form.country}`,
    `linkedin=${form.linkedin}`,
    `portfolio=${form.portfolio}`,
    `dribbble=${form.dribbble}`,
    `website=${form.website}`,
  ].join("&");
  return `powershell -NoProfile -Command "$s='${payload}'; [BitConverter]::ToString([Security.Cryptography.SHA256]::Create().ComputeHash([Text.Encoding]::UTF8.GetBytes($s))).Replace('-','').ToLower()"
  `;
}

export default function Application() {
  const navigate = useNavigate();
  const copyPrefix = useMemo(() => getCopyPrefix(), []);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    linkedin: "",
    portfolio: "",
    dribbble: "",
    website: "",
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
    const missing = [];
    if (!form.name.trim()) missing.push("name");
    if (!form.email.trim() || !form.email.includes("@")) missing.push("email");

    if (missing.length > 0) {
      setStatus({
        type: "error",
        message: `Please fill in: ${missing.join(", ")}`,
      });
      return;
    }

    const trimmedHash = hash.trim();
    const name = form.name.trim();
    const email = form.email.trim();

    setSending(true);
    setStatus(null);

    try {
      if (!trimmedHash) {
        await submitDesignApplication(name, email, false);
        setStatus({
          type: "error",
          message: "Please fill in: hash",
        });
        return;
      }

      if (trimmedHash.length !== 64) {
        await submitDesignApplication(name, email, false);
        setStatus({
          type: "error",
          message: "Please paste a valid 64-character hash",
        });
        return;
      }

      await submitDesignApplication(name, email, true);
      navigate("/application/success", {
        state: { name },
      });
    } catch {
      setStatus({
        type: "error",
        message: "Could not send application. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  const selectedCountry = useMemo(
    () => getCountryByCode(form.country),
    [form.country]
  );
  const dialCode = selectedCountry?.dial || "";

  const hashCommand = useMemo(
    () => buildHashCommand(form, dialCode),
    [form, dialCode]
  );

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
              <div className="application-field">
                <label className="application-field-label" htmlFor="app-name">Name</label>
                <input
                  id="app-name"
                  className="application-input"
                  name="name"
                  placeholder="Alex Morgan"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="application-field">
                <label className="application-field-label" htmlFor="app-email">Email</label>
                <input
                  id="app-email"
                  className="application-input"
                  name="email"
                  placeholder="alex@designstudio.com"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="application-field">
                <label className="application-field-label" htmlFor="app-country">
                  Country <span className="application-optional">optional</span>
                </label>
                <select
                  id="app-country"
                  className={`application-input application-select${form.country ? "" : " is-placeholder"}`}
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="application-field">
                <label className="application-field-label" htmlFor="app-phone">
                  Phone <span className="application-optional">optional</span>
                </label>
                <div className="application-phone-wrap">
                  <span className="application-phone-prefix">
                    {dialCode || "+…"}
                  </span>
                  <input
                    id="app-phone"
                    className="application-phone-input"
                    name="phone"
                    type="tel"
                    placeholder="555 123 4567"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <p className="application-optional-note">
                Portfolio links below are <strong>optional</strong> — share them if you
                have work online, or leave them blank.
              </p>

              <div className="application-field">
                <label className="application-field-label" htmlFor="app-linkedin">
                  LinkedIn URL <span className="application-optional">optional</span>
                </label>
                <input
                  id="app-linkedin"
                  className="application-input"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/yourname"
                  type="url"
                  value={form.linkedin}
                  onChange={handleChange}
                />
              </div>
              <div className="application-field">
                <label className="application-field-label" htmlFor="app-portfolio">
                  Portfolio <span className="application-optional">optional</span>
                </label>
                <input
                  id="app-portfolio"
                  className="application-input"
                  name="portfolio"
                  placeholder="https://yourportfolio.com"
                  type="url"
                  value={form.portfolio}
                  onChange={handleChange}
                />
              </div>
              <div className="application-field">
                <label className="application-field-label" htmlFor="app-dribbble">
                  Dribbble <span className="application-optional">optional</span>
                </label>
                <input
                  id="app-dribbble"
                  className="application-input"
                  name="dribbble"
                  placeholder="https://dribbble.com/username"
                  type="url"
                  value={form.dribbble}
                  onChange={handleChange}
                />
              </div>
              <div className="application-field">
                <label className="application-field-label" htmlFor="app-website">
                  Website <span className="application-optional">optional</span>
                </label>
                <input
                  id="app-website"
                  className="application-input"
                  name="website"
                  placeholder="https://yourname.dev"
                  type="url"
                  value={form.website}
                  onChange={handleChange}
                />
              </div>
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
              placeholder="e.g. a3f5b2c1d4e6…"
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
