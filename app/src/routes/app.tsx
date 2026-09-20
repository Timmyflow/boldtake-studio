import { createFileRoute, redirect } from "@tanstack/react-router";

// The portfolio has no generation workspace. Preserve old /app links.
export const Route = createFileRoute("/app")({
  beforeLoad: () => { throw redirect({ to: "/", replace: true }); },
});
