import { createFileRoute } from "@tanstack/react-router";
import TitleBar from "../components/title-bar";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <TitleBar title="Dashboard" />
      <div className="">bitch</div>
    </>
  );
}
