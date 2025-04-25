import { createFileRoute } from "@tanstack/react-router";
import TitleBar from "../components/title-bar";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import Drawer from "../components/drawer";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { motion } from "motion/react";
import { isURL, isEmail } from "validator";
import { load } from "@tauri-apps/plugin-store";
import { PasswordProps } from "../interfaces";
import { loadPasswords, savePassword } from "../lib/db";
import { truncate } from "../utils/truncate";
// @ts-ignore
import faviconFetch from "favicon-fetch";
import { hostname } from "@tauri-apps/plugin-os";

// Helper function to normalize URLs
const normalizeUrl = (url: string): string => {
  if (!url) return url;
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
};

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

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

  const validateFields = () => {
    // Normalize URL before validation
    const normalizedUrl = normalizeUrl(payload.url.trim());

    const errors: Record<string, boolean> = {
      url: !isURL(normalizedUrl),
      email: !isEmail(payload.email.trim()),
      password: payload.password.trim() === "",
      name: payload.name.trim() === "",
    };

    setValidationErrors(errors);
    setErrorCount((prev) => prev + 1);

    return !Object.values(errors).some((error) => error);
  };

  const [machineUid, setMachineUid] = useState<string>("");

  const fetchPasswords = async (masterPassword: string) => {
    const decrypted = await loadPasswords(masterPassword);
    setPasswords(decrypted);
  };

  useEffect(() => {
    const fetchMachineUid = async () => {
      const store = await load("store.json", { autoSave: true });
      const machineUid = await store.get<{ value: string }>("machine-uid");
      setMachineUid(machineUid!.value);

      fetchPasswords(machineUid!.value);
    };
    fetchMachineUid();
  }, []);

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
            onClick={async () => {
              if (validateFields()) {
                // Normalize URL before saving
                const normalizedPayload = {
                  ...payload,
                  url: normalizeUrl(payload.url.trim()),
                };

                await savePassword(
                  {
                    id: crypto.randomUUID(),
                    ...normalizedPayload,
                  },
                  machineUid
                );
                fetchPasswords(machineUid);
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
        <div className="">
          <div className="flex items-center justify-between gap-x-10">
            <Input placeholder="Search" />
            <Button onClick={() => setIsModalOpen(true)} className="shrink-0">
              Add Password
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 prevent-select">
            {passwords.map((password) => (
              <div
                key={password.id}
                className="bg-white p-3 rounded-3xl flex border border-accent/10 gap-x-3"
              >
                <div className="size-10 bg-accent/10 rounded-2xl">
                  <img
                    src={faviconFetch({
                      hostname: new URL(normalizeUrl(password.url)).hostname,
                    })}
                    alt={password.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="">
                  <p className="font-medium">{password.name}</p>
                  <p className="text-sm truncate text-gray-500">
                    {new URL(normalizeUrl(password.url)).hostname}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
