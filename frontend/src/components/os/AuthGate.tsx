import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { LoginScreen, type LoginScreenStatus } from "./LoginScreen";
import {
  isCorrectAccessPhrase,
  readAuthGateUnlocked,
  writeAuthGateUnlocked
} from "./usePortfolioAuthGate";

type AuthGateProps = {
  children: ReactNode;
};

const idleMessage = "Type Hire Sawyer to boot the desktop.";
const errorMessage = "Phrase must match exactly: Hire Sawyer";
const successMessage = "Access granted. Loading Portfolio OS...";

export function AuthGate({ children }: AuthGateProps) {
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return readAuthGateUnlocked(window.sessionStorage);
  });
  const [phrase, setPhrase] = useState("");
  const [status, setStatus] = useState<LoginScreenStatus>("idle");
  const [message, setMessage] = useState(idleMessage);
  const [submitting, setSubmitting] = useState(false);

  function handlePhraseChange(value: string) {
    setPhrase(value);
    if (status !== "success") {
      setStatus("idle");
      setMessage(idleMessage);
    }
  }

  function handleSubmit() {
    if (!phrase) {
      setStatus("idle");
      setMessage(idleMessage);
      return;
    }

    if (!isCorrectAccessPhrase(phrase)) {
      setStatus("idle");
      window.setTimeout(() => {
        setStatus("error");
        setMessage(errorMessage);
      }, 0);
      return;
    }

    setSubmitting(true);
    setStatus("success");
    setMessage(successMessage);
    writeAuthGateUnlocked(window.sessionStorage);
    window.setTimeout(() => setUnlocked(true), 420);
  }

  return (
    <AnimatePresence mode="wait">
      {unlocked ? (
        <motion.div
          key="portfolio-os-desktop"
          className="portfolio-os-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.42 }}
        >
          {children}
        </motion.div>
      ) : (
        <motion.div
          key="portfolio-os-login"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.42 }}
        >
          <LoginScreen
            phrase={phrase}
            status={status}
            message={message}
            submitting={submitting}
            onPhraseChange={handlePhraseChange}
            onSubmit={handleSubmit}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
