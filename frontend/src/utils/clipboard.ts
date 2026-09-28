// Copy text to the clipboard, with a legacy fallback for browsers/contexts where the
// async Clipboard API is unavailable (e.g. non-secure contexts, older Safari).

export async function copyToClipboard(text: string): Promise<boolean> {
  const canUseAsyncClipboard =
    typeof navigator !== "undefined" && navigator.clipboard !== undefined && window.isSecureContext;

  if (canUseAsyncClipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy path below.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let success = false;
  try {
    success = document.execCommand("copy");
  } catch {
    success = false;
  }

  textarea.remove();
  return success;
}
