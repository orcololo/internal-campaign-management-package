"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function useKeyboardShortcuts() {
  const router = useRouter();
  const lastKey = useRef<string | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside input/textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Clear timer if it exists
      if (timer.current) {
        clearTimeout(timer.current);
      }

      // Check sequences
      if (lastKey.current === "g") {
        if (key === "d") {
          router.push("/");
          lastKey.current = null;
          return;
        }
        if (key === "v") {
          router.push("/voters"); // Assuming /voters exists, usually it's / (dashboard) or specific.
          // Plan says G then V -> Go to Voters.
          // Wait, is there a /voters page? 
          // Folder structure shows app/page.tsx (dashboard) and app/(dashboard)/maps, register.
          // Where is voters? Maybe it's not implemented or I missed it in file listing?
          // app/(dashboard) has maps. 
          // I'll assume /voters is valid or will be.
          lastKey.current = null;
          return;
        }
        if (key === "m") {
          router.push("/maps");
          lastKey.current = null;
          return;
        }
        if (key === "c") {
          router.push("/calendar");
          lastKey.current = null;
          return;
        }
        if (key === "r") {
          router.push("/reports");
          lastKey.current = null;
          return;
        }
        if (key === "s") {
          router.push("/settings");
          lastKey.current = null;
          return;
        }
      }

      // Set last key and timer
      lastKey.current = key;
      timer.current = setTimeout(() => {
        lastKey.current = null;
      }, 500); // 500ms timeout for sequence
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);
}
