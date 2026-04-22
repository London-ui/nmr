import { createFileRoute } from "@tanstack/react-router";
import { Experience } from "@/components/experience/Experience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Para ti — uma história nossa" },
      { name: "description", content: "Uma experiência cinematográfica feita com amor, só pra ti." },
      { property: "og:title", content: "Para ti" },
      { property: "og:description", content: "Uma experiência cinematográfica feita com amor." },
    ],
  }),
  component: Index,
});

function Index() {
  return <Experience />;
}
