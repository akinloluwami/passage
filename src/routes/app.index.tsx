import { createFileRoute } from "@tanstack/react-router";
import TitleBar from "../components/title-bar";
import { useState } from "react";
import { Button } from "../components/ui/button";
import Drawer from "../components/drawer";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

interface PasswordProps {
  id: string;
  website: string;
  email: string;
  username: string;
  password: string;
  note: string;
}

function RouteComponent() {
  const [passwords, setPasswords] = useState<PasswordProps[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Drawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add new password"
      >
        <div className="space-y-3">
          <Input placeholder="Website" />
          <Input placeholder="Email" />
          <Input placeholder="Username" />
          <Input isPassword placeholder="Password" />
          <Textarea placeholder="Note" />
          <Button className="w-full">Add Password</Button>
        </div>
      </Drawer>
      <TitleBar title="Passwords" />
      {passwords.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center gap-y-5">
            <img src="/no-passwords.png" alt="no-passwords" className="w-64" />
            <p className="text-gray-500 text-lg">No passwords found</p>
            <Button onClick={() => setIsModalOpen(true)}>Add Password</Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
