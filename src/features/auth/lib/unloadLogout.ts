let handler: VoidFunction | null = null;

export function registerUnloadLogout() {
  if (handler) return;

  handler = function () {
    navigator.sendBeacon("/api/auth/logout");
  };

  window.addEventListener("beforeunload", handler);
}

export function unregisterUnloadLogout() {
  if (!handler) return;

  window.removeEventListener("beforeunload", handler);
  handler = null;
}
