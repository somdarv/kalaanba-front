import { ApiError } from "@/lib/api";

/** Human-readable message for an auth API failure. */
export function messageFor(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Something went wrong. Please try again.";
}

/** Inline submit/API error line for auth forms. */
export function SubmitError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-danger">
      {message}
    </p>
  );
}
