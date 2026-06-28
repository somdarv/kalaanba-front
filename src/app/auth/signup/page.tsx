import { redirect } from "next/navigation";

/**
 * Legacy signup route. Identifier-first auth (ADR-0004) collapsed the
 * login/signup split into a single entry — old deep links land there.
 */
export default function SignupRedirect() {
  redirect("/auth/login");
}
