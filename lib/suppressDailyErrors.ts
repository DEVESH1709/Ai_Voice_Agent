"use client";

/**
 * Suppress Daily.js "Meeting ended due to ejection" errors from appearing
 * in the console. These are expected when calls end normally.
 */

const SUPPRESSED_PATTERNS = [
  /meeting ended due to ejection/i,
  /meeting has ended/i,
  /vapi error/i,
];

function shouldSuppress(arg: unknown): boolean {
  // Suppress empty objects (Vapi sometimes emits {} as error)
  if (
    arg &&
    typeof arg === "object" &&
    !(arg instanceof Error) &&
    Object.keys(arg).length === 0
  ) {
    return true;
  }

  if (typeof arg === "string") {
    return SUPPRESSED_PATTERNS.some((pattern) => pattern.test(arg));
  }
  if (arg instanceof Error) {
    return SUPPRESSED_PATTERNS.some((pattern) => pattern.test(arg.message));
  }
  if (arg && typeof arg === "object" && "message" in arg) {
    return SUPPRESSED_PATTERNS.some((pattern) =>
      pattern.test(String((arg as { message: unknown }).message))
    );
  }
  return false;
}

let isPatched = false;

export function patchConsoleToDailySuppressErrors() {
  if (typeof window === "undefined" || isPatched) return;
  isPatched = true;

  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args: unknown[]) => {
    if (args.some(shouldSuppress)) return;
    originalError.apply(console, args);
  };

  console.warn = (...args: unknown[]) => {
    if (args.some(shouldSuppress)) return;
    originalWarn.apply(console, args);
  };

  // Also intercept unhandled rejections at window level
  window.addEventListener("unhandledrejection", (event) => {
    if (shouldSuppress(event.reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener(
    "error",
    (event) => {
      if (shouldSuppress(event.error) || shouldSuppress(event.message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true // capture phase to intercept early
  );
}
