// navigator.clipboard is only available in secure contexts (https / localhost),
// so fall back to execCommand when the viewer is served over plain http.
export async function copyToClipboard(text) {
  const value = text == null ? "" : String(text);

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    if (!document.execCommand("copy")) throw new Error("copy command failed");
  } finally {
    document.body.removeChild(textarea);
  }
}
