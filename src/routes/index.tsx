import { createFileRoute } from "@tanstack/react-router";
import { APP_NAME } from "../utils/constants";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SiGithub } from "react-icons/si";
import { openUrl } from "@tauri-apps/plugin-opener";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  interface OnboardingSlide {
    title: string;
    description: string;
    extra?: React.ReactNode;
  }

  const goToNextSlide = () => {
    setCurrentSlide(currentSlide + 1);
  };

  const onboardingSlides: OnboardingSlide[] = [
    {
      title: `Welcome to ${APP_NAME}`,
      description: `${APP_NAME} is a free, local‑first, open‑source password manager for
          macOS that keeps all your credentials stored only on
          your device.`,
      extra: (
        <Button className="mt-4" onClick={goToNextSlide}>
          Continue
        </Button>
      ),
    },
    {
      title: "Local‑First Encryption",
      description:
        "All your passwords are encrypted and stored only on your device, giving you full control. Passage never sees your data.",
      extra: (
        <Button className="mt-4" onClick={goToNextSlide}>
          Continue
        </Button>
      ),
    },
    {
      title: "Customizable Keyboard Shortcuts",
      description:
        "Set global keyboard shortcuts to instantly open your vault and access your credentials in a flash.",
      extra: (
        <Button className="mt-4" onClick={goToNextSlide}>
          Continue
        </Button>
      ),
    },
    {
      title: "Strong Password Generator",
      description:
        "Create unique, complex passwords with customizable length and character sets.",
      extra: (
        <Button className="mt-4" onClick={goToNextSlide}>
          Continue
        </Button>
      ),
    },
    {
      title: "Open Source",
      description: `${APP_NAME} is fully open source—audit the code and contribute improvements to help shape its future.`,
      extra: (
        <div className="flex items-center gap-x-2">
          <Button className="mt-4" onClick={goToNextSlide}>
            Continue
          </Button>
          <Button
            className="mt-4 bg-white !text-black shadow hover:bg-black hover:!text-white transition-colors duration-500 flex items-center gap-x-2"
            onClick={async () => {
              await openUrl("https://github.com/passage-inc/passage");
            }}
          >
            <SiGithub />
            Star on GitHub
          </Button>
        </div>
      ),
    },
    {
      title: "You're all set",
      description:
        "Passage is ready to use. Click the button below to get started and add your first password.",
      extra: <Button className="mt-4">Get Started</Button>,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="h-screen p-10 rounded-4xl bg-gradient-to-b from-[#a0d1fd] to-white w-full flex flex-col items-center">
      <motion.div
        className="size-[120px] mt-12 rounded-4xl bg-white"
        key={`logo-${currentSlide}`}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 0.5,
          times: [0, 0.5, 1],
          ease: "easeInOut",
        }}
      ></motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="w-full mt-24"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-semibold">
            {onboardingSlides[currentSlide].title}
          </h1>
          <p className="text-gray-001">
            {onboardingSlides[currentSlide].description}
          </p>
          <div className="mt-4">{onboardingSlides[currentSlide].extra}</div>
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center gap-x-2 justify-center mt-14">
        {onboardingSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`size-3 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-accent" : "bg-gray-001/40"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
