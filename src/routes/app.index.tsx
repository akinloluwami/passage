import { createFileRoute } from "@tanstack/react-router";
import TitleBar from "../components/title-bar";
import { useState, useEffect, useCallback } from "react";
import { Button } from "../components/ui/button";
import Drawer from "../components/drawer";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { motion } from "motion/react";
import faviconFetch from "favicon-fetch";
import getTitleAtUrl from "get-title-at-url";

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
  favicon?: string;
  title?: string;
  domain?: string;
}

// Debounce function
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function RouteComponent() {
  const [passwords, setPasswords] = useState<PasswordProps[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, boolean>
  >({
    website: false,
    email: false,
    username: false,
    password: false,
  });
  const [errorCount, setErrorCount] = useState(0);

  const [payload, setPayload] = useState<{
    website: string;
    email: string;
    username: string;
    password: string;
    note: string;
    favicon?: string;
    title?: string;
    domain?: string;
  }>({
    website: "",
    email: "",
    username: "",
    password: "",
    note: "",
    favicon: "",
    title: "",
    domain: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Debounce the website input
  const debouncedWebsite = useDebounce(payload.website, 600);

  // Function to fetch website metadata
  const fetchWebsiteMetadata = useCallback(async (url: string) => {
    if (!url || url.trim() === "") return;

    setIsLoading(true);

    try {
      // Add protocol if it doesn't exist
      let fullUrl = url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        fullUrl = "https://" + url;
      }

      const urlObj = new URL(fullUrl);
      const domain = urlObj.hostname;

      // Extract a sensible title from the domain
      const domainParts = domain.split(".");
      let siteName;

      const title = await getTitleAtUrl(fullUrl);

      if (title) {
        siteName = title;
      } else if (domainParts.length >= 2) {
        if (domainParts.length > 2 && domainParts[0] !== "www") {
          siteName = domainParts[1];
        } else {
          siteName = domainParts[domainParts.length - 2];
        }
        siteName = siteName.charAt(0).toUpperCase() + siteName.slice(1);
      } else {
        siteName = domain;
      }

      const favicon_ = await faviconFetch({ hostname: domain });

      // Use Google's favicon service
      const favicon =
        favicon_ || `https://www.google.com/s2/favicons?domain=${domain}`;

      // Set payload with the metadata
      setPayload((prev) => ({
        ...prev,
        domain,
        title: siteName,
        favicon,
      }));
    } catch (error) {
      console.error("Error fetching website metadata:", error);

      // Try to extract domain and set a basic title even if the fetch failed
      try {
        let fullUrl = url;
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          fullUrl = "https://" + url;
        }

        const urlObj = new URL(fullUrl);
        const domain = urlObj.hostname;

        const domainParts = domain.split(".");
        let siteName;
        if (domainParts.length >= 2) {
          if (domainParts.length > 2 && domainParts[0] !== "www") {
            siteName = domainParts[1];
          } else {
            siteName = domainParts[domainParts.length - 2];
          }
          siteName = siteName.charAt(0).toUpperCase() + siteName.slice(1);
        } else {
          siteName = domain;
        }

        // Use Google's favicon service as fallback
        const favicon = `https://www.google.com/s2/favicons?domain=${domain}`;

        setPayload((prev) => ({
          ...prev,
          domain,
          title: siteName,
          favicon,
        }));
      } catch (innerError) {
        console.error("Error extracting domain:", innerError);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Watch for changes to the debounced website value
  useEffect(() => {
    if (debouncedWebsite && debouncedWebsite.trim() !== "") {
      const websiteRegex =
        /^[a-zA-Z0-9-]+(\.[\w-]+)+(\/[\w\-\.~!$&'\(\)*+,;=:@%]*)*$/;
      if (websiteRegex.test(debouncedWebsite.trim())) {
        fetchWebsiteMetadata(debouncedWebsite);
      }
    }
  }, [debouncedWebsite, fetchWebsiteMetadata]);

  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const websiteRegex =
      /^[a-zA-Z0-9-]+(\.[\w-]+)+(\/[\w\-\.~!$&'\(\)*+,;=:@%]*)*$/;

    const errors: Record<string, boolean> = {
      website: !websiteRegex.test(payload.website.trim()),
      email: !emailRegex.test(payload.email.trim()),
      password: payload.password.trim() === "",
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
            website: "",
            email: "",
            username: "",
            password: "",
            note: "",
            favicon: "",
            title: "",
            domain: "",
          });
        }}
        title="Add new password"
      >
        <div className="flex items-center gap-x-3 bg-accent/5 p-3 rounded-2xl mb-5">
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
        </div>
        <div className="space-y-3">
          <motion.div
            key={`website-${errorCount}`}
            animate={{
              x: validationErrors.website
                ? [-20, 20, -15, 15, -10, 10, -5, 5, 0]
                : [0],
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <Input
              placeholder="Website"
              value={payload.website}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.trim() === "") {
                  // Clear title and domain when website field is empty
                  setPayload({
                    ...payload,
                    website: newValue,
                    title: "",
                    domain: "",
                    favicon: "",
                  });
                } else {
                  setPayload({ ...payload, website: newValue });
                }
              }}
              isLoading={isLoading}
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
                // Reset payload after saving
                setPayload({
                  website: "",
                  email: "",
                  username: "",
                  password: "",
                  note: "",
                  favicon: "",
                  title: "",
                  domain: "",
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
