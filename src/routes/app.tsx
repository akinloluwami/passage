import { createFileRoute, Outlet } from "@tanstack/react-router";
import Sidebar from "../components/sidebar";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="h-screen bg-gradient-to-b from-accent/20 to-gray-100 p-3 flex items-start gap-x-10">
        <Sidebar />
        <div className="flex-1 mt-7">
          <Outlet />
        </div>
      </div>
    </>
  );
}
