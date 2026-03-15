"use client";

import { useState, useEffect, useCallback } from "react";

interface UseTypingEffectOptions {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

export function useTypingEffect({
  words,
  typeSpeed = 80,
  deleteSpeed = 45,
  pauseDuration = 1800,
}: UseTypingEffectOptions) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const fullWord = words[currentWordIndex] ?? "";

    if (!isDeleting) {
      // Typing
      setCurrentText(fullWord.substring(0, currentText.length + 1));

      if (currentText === fullWord) {
        // Finished typing — pause then start deleting
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }
    } else {
      // Deleting
      setCurrentText(fullWord.substring(0, currentText.length - 1));

      if (currentText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        return;
      }
    }
  }, [currentText, currentWordIndex, isDeleting, words, pauseDuration]);

  useEffect(() => {
    const speed = isDeleting ? deleteSpeed : typeSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, typeSpeed, deleteSpeed]);

  return { currentText, isDeleting };
}
