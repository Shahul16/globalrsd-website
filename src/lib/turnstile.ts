/**
 * Cloudflare Turnstile Server-Side Validation Helper
 * Validates Turnstile response tokens with Cloudflare Siteverify API.
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

export async function verifyTurnstile(
  token: string,
  remoteip: string | null = null,
  expectedAction?: string
): Promise<{ ok: boolean; reason?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // If secret key is not configured in environment variables, skip validation (fail open in development)
  if (!secret) {
    return { ok: true };
  }

  if (!token) {
    return { ok: false, reason: "Missing Turnstile verification token" };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secret);
    formData.append("response", token);
    if (remoteip) {
      formData.append("remoteip", remoteip);
    }

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (!res.ok) {
      console.error(`Turnstile siteverify HTTP error: ${res.status}`);
      // Fail open on Cloudflare server errors to prevent legitimate visitors from being blocked
      return { ok: true };
    }

    const outcome = await res.json();

    if (!outcome.success) {
      const errors = Array.isArray(outcome["error-codes"])
        ? outcome["error-codes"].join(", ")
        : "verification failed";
      return { ok: false, reason: errors };
    }

    if (expectedAction && outcome.action && outcome.action !== expectedAction) {
      return { ok: false, reason: `Action mismatch: expected ${expectedAction}, got ${outcome.action}` };
    }

    return { ok: true };
  } catch (err: any) {
    console.error("Turnstile verification network error:", err);
    // Fail open on network errors
    return { ok: true };
  }
}
