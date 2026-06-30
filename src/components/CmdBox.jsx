import { useState } from "react";

function buildClipboardText(value, copyPrefix, selectedText) {
  const copied = selectedText || value;
  return copyPrefix ? `${copyPrefix}${copied}` : copied;
}

export default function CmdBox({ value, copyPrefix = "", onCopied }) {
  const [copied, setCopied] = useState(false);

  const notifyCopied = () => {
    setCopied(true);
    onCopied?.();
    setTimeout(() => setCopied(false), 1500);
  };

  const writeToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    notifyCopied();
  };

  const handleCopy = async () => {
    await writeToClipboard(buildClipboardText(value, copyPrefix));
  };

  const handleNativeCopy = (e) => {
    e.preventDefault();
    const selectedText = window.getSelection().toString();
    const text = buildClipboardText(value, copyPrefix, selectedText);
    e.clipboardData.setData("text/plain", text);
    notifyCopied();
  };

  return (
    <div className="cmd-box">
      <button type="button" onClick={handleCopy} className="cmd-box-copy">
        {copied ? "Copied ✓" : "Copy"}
      </button>

      <pre className="cmd-box-pre" onCopy={handleNativeCopy}>
        <code>{value}</code>
      </pre>
    </div>
  );
}
