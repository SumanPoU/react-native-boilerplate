export interface ToastMessageOptions {
  title: string;
  message?: string;
  preset?: "done" | "error" | "none";
}

export interface BackendErrorToastOptions {
  fallbackTitle?: string;
  frontendMessage?: string;
}
