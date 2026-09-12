import { redirect } from "next/navigation";

/** Legacy route kept alive — the verification system lives at /verify. */
export default function VerifyCertificateRedirect() {
  redirect("/verify");
}
