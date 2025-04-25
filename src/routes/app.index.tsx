import { createFileRoute } from "@tanstack/react-router";
import TitleBar from "../components/title-bar";
import { useState, useEffect, useCallback } from "react";
import { Button } from "../components/ui/button";
import Drawer from "../components/drawer";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { motion } from "motion/react";
//@ts-ignore
import faviconFetch from "favicon-fetch";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

interface PasswordProps {
  id?: string;
  url: string;
  name: string;
  email: string;
  username: string;
  password: string;
  note: string;
}

function RouteComponent() {
  const [passwords, setPasswords] = useState<PasswordProps[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, boolean>
  >({
    url: false,
    email: false,
    username: false,
    password: false,
    name: false,
  });
  const [errorCount, setErrorCount] = useState(0);

  const [payload, setPayload] = useState<PasswordProps>({
    url: "",
    name: "",
    email: "",
    username: "",
    password: "",
    note: "",
  });

  //   const [isLoading, setIsLoading] = useState(false);

  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const websiteRegex =
      /^[a-zA-Z0-9-]+(\.[\w-]+)+(\/[\w\-\.~!$&'\(\)*+,;=:@%]*)*$/;

    const errors: Record<string, boolean> = {
      url: !websiteRegex.test(payload.url.trim()),
      email: !emailRegex.test(payload.email.trim()),
      password: payload.password.trim() === "",
      name: payload.name.trim() === "",
    };

    setValidationErrors(errors);
    setErrorCount((prev) => prev + 1);

    return !Object.values(errors).some((error) => error);
  };

  return (
    <>
      <Drawer
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);

          setPayload({
            url: "",
            email: "",
            name: "",
            username: "",
            password: "",
            note: "",
          });
        }}
        title="Add new password"
      >
        {/* <div className="flex items-center gap-x-3 bg-accent/5 p-3 rounded-2xl mb-5">
          {payload.favicon ? (
            <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center overflow-hidden">
              <img
                src={payload.favicon}
                alt={payload.title || "Website favicon"}
                className="w-7"
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-accent/10 rounded-2xl"></div>
          )}
          <div className="">
            <p className="text-sm font-medium">{payload.title || "Website"}</p>
            <p className="text-sm text-gray-500">
              {payload.domain || "Enter a website URL"}
            </p>
          </div>
        </div> */}
        <div className="space-y-3">
          <motion.div
            key={`name-${errorCount}`}
            animate={{
              x: validationErrors.name
                ? [-20, 20, -15, 15, -10, 10, -5, 5, 0]
                : [0],
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <Input
              placeholder="Name"
              value={payload.name}
              onChange={(e) => setPayload({ ...payload, name: e.target.value })}
            />
          </motion.div>
          <motion.div
            key={`website-${errorCount}`}
            animate={{
              x: validationErrors.url
                ? [-20, 20, -15, 15, -10, 10, -5, 5, 0]
                : [0],
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <Input
              placeholder="URL"
              value={payload.url}
              onChange={(e) => {
                setPayload({ ...payload, url: e.target.value });
              }}
            />
          </motion.div>

          <motion.div
            key={`email-${errorCount}`}
            animate={{
              x: validationErrors.email
                ? [-20, 20, -15, 15, -10, 10, -5, 5, 0]
                : [0],
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <Input
              placeholder="Email"
              value={payload.email}
              onChange={(e) =>
                setPayload({ ...payload, email: e.target.value })
              }
            />
          </motion.div>

          <motion.div
            key={`username-${errorCount}`}
            animate={{
              x: validationErrors.username
                ? [-20, 20, -15, 15, -10, 10, -5, 5, 0]
                : [0],
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <Input
              placeholder="Username"
              value={payload.username}
              onChange={(e) =>
                setPayload({ ...payload, username: e.target.value })
              }
            />
          </motion.div>

          <motion.div
            key={`password-${errorCount}`}
            animate={{
              x: validationErrors.password
                ? [-20, 20, -15, 15, -10, 10, -5, 5, 0]
                : [0],
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <Input
              isPassword
              placeholder="Password"
              value={payload.password}
              onChange={(e) =>
                setPayload({ ...payload, password: e.target.value })
              }
            />
          </motion.div>

          <Textarea
            placeholder="Note"
            value={payload.note}
            onChange={(e) => setPayload({ ...payload, note: e.target.value })}
          />
          <Button
            className="w-full"
            onClick={() => {
              if (validateFields()) {
                setPasswords([
                  ...passwords,
                  {
                    id: crypto.randomUUID(),
                    ...payload,
                  },
                ]);
                setIsModalOpen(false);

                setPayload({
                  url: "",
                  name: "",
                  email: "",
                  username: "",
                  password: "",
                  note: "",
                });
              }
            }}
          >
            Add Password
          </Button>
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
