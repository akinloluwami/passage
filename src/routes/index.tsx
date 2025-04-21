import { createFileRoute } from "@tanstack/react-router";
import { APP_NAME } from "../utils/constants";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SiGithub } from "react-icons/si";
import { openUrl } from "@tauri-apps/plugin-opener";
import { invoke } from "@tauri-apps/api/core";
import OTPInput from "react-otp-input";
import { load } from "@tauri-apps/plugin-store";
import { platform } from "@tauri-apps/plugin-os";
import bcrypt from "bcryptjs";

// Function to hash the PIN using bcrypt
async function hashPin(pin: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pin, salt);
}

// Function to validate a PIN against the stored hash
async function validatePin(inputPin: string): Promise<boolean> {
  const store = await load("store.json", { autoSave: true });
  const storedPinData = await store.get<{ value: string }>("pin");

  if (!storedPinData) {
    return false; // No PIN has been set
  }

  return bcrypt.compare(inputPin, storedPinData.value);
}

// Function to check if a PIN has been set
async function hasPinBeenSet(): Promise<boolean> {
  const store = await load("store.json", { autoSave: true });
  const storedPinData = await store.get<{ value: string }>("pin");
  return !!storedPinData;
}

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  interface OnboardingSlide {
    title: string;
    description: string;
    extra?: React.ReactNode;
  }

  const [showCreatePinScreen, setShowCreatePinScreen] = useState(false);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const goToNextSlide = () => {
    setCurrentSlide(currentSlide + 1);
  };

  const openAppWindow = async () => {
    await invoke("open_app_window");
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
      extra: (
        <Button className="mt-4" onClick={() => setShowCreatePinScreen(true)}>
          Get Started
        </Button>
      ),
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const platform_ = platform();

  const [machineUid, setMachineUid] = useState("");

  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const getOrSetMachineUid = async () => {
    const store = await load("store.json", { autoSave: true });

    const val = await store.get<{ value: string }>("machine-uid");

    if (!val) {
      const uuid = crypto.randomUUID();
      store.set("machine-uid", { value: uuid });
      setMachineUid(uuid);
    } else {
      setMachineUid(val.value);
    }
  };

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const pinExists = await hasPinBeenSet();
      setHasCompletedOnboarding(pinExists);
      if (pinExists) {
        setShowLoginScreen(true);
      }
    };

    getOrSetMachineUid();
    checkOnboardingStatus();
  }, []);

  const savePin = async () => {
    if (pin.length !== 4) {
      setPinError(true);
      setErrorCount((prev) => prev + 1);
      return;
    }

    const store = await load("store.json", { autoSave: true });
    const hashedPin = await hashPin(pin);
    store.set("pin", { value: hashedPin });
    await openAppWindow();
  };

  const loginWithPin = async () => {
    if (pin.length !== 4) {
      setPinError(true);
      setErrorCount((prev) => prev + 1);
      return;
    }

    const isValid = await validatePin(pin);
    if (isValid) {
      setPinError(false);
      await openAppWindow();
      setPin("");
    } else {
      setPinError(true);
      setErrorCount((prev) => prev + 1);
      setPin("");
    }
  };

  return (
    <div className="h-screen p-10 rounded-4xl bg-gradient-to-b from-[#a0d1fd] to-white w-full flex flex-col items-center">
      {!showCreatePinScreen && !showLoginScreen && (
        <>
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
        </>
      )}
      {showCreatePinScreen && (
        <div className="flex flex-col items-center">
          <div className="size-[120px] mt-12 rounded-4xl bg-white"></div>
          <div className="mt-20">
            <h1 className="text-3xl font-semibold">Create a PIN</h1>
            <p className="text-gray-001">
              Create a PIN to secure your vault. This PIN will be used to unlock
              your vault.
            </p>
            <motion.div
              className="mt-7"
              key={`pin-input-${pinError}`}
              animate={{
                x: [-20, 20, -15, 15, -10, 10, -5, 5, 0],
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <OTPInput
                value={pin}
                onChange={setPin}
                numInputs={4}
                renderInput={(props) => <input {...props} />}
                renderSeparator={() => <div className="w-2" />}
                shouldAutoFocus
                inputStyle={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "8px",
                  fontSize: "24px",
                  backgroundColor: "#9fcffe40",
                  color: "black",
                  border: "1px solid #9fcffe80",
                  outline: "none",
                }}
              />
            </motion.div>
            <Button className="mt-4" onClick={savePin}>
              Continue
            </Button>
          </div>
        </div>
      )}
      {showLoginScreen && (
        <div className="flex flex-col items-center">
          <div className="size-[120px] mt-12 rounded-4xl bg-white"></div>
          <div className="mt-20">
            <h1 className="text-3xl font-semibold">Vault is locked</h1>
            <p className="text-gray-001">
              Enter your PIN to unlock your vault and access your passwords.
            </p>
            <motion.div
              className="mt-7"
              key={`pin-input-login-${errorCount}`}
              animate={{
                x: pinError ? [-20, 20, -15, 15, -10, 10, -5, 5, 0] : [0],
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <OTPInput
                value={pin}
                onChange={setPin}
                numInputs={4}
                renderInput={(props) => <input {...props} type="password" />}
                renderSeparator={() => <div className="w-2" />}
                inputStyle={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "8px",
                  fontSize: "24px",
                  backgroundColor: "#9fcffe40",
                  color: "black",
                  border: "1px solid #9fcffe80",
                  outline: "none",
                }}
              />
            </motion.div>
            <Button className="mt-4" onClick={loginWithPin}>
              Unlock
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
