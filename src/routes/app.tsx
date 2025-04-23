import { createFileRoute, Outlet } from "@tanstack/react-router";
import Sidebar from "../components/sidebar";
import Modal from "../components/modal";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Modal />
      <div className="h-screen bg-gradient-to-b from-accent/20 to-gray-100 p-3 flex items-start gap-x-10 overflow-y-hidden">
        <Sidebar />
        <div className="flex-1 mt-7 overflow-y-auto h-full p-5">
          <Outlet />
        </div>
      </div>
    </>
  );
}
