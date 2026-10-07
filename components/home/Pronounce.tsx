"use client";

import { useRef, useState } from "react";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

/** Plays a recording of my name; falls back to speech synthesis until one is added. */
export default function Pronounce() {
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  const play = () => {
    const src = profile.pronunciation.audio;
    if (src) {
      audio.current ??= new Audio(src);
      audio.current.currentTime = 0;
      setPlaying(true);
      audio.current.onended = () => setPlaying(false);
      audio.current.play().catch(() => setPlaying(false));
      return;
    }
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance("Harsh Bho-guh-yah-ta");
    const voices = window.speechSynthesis.getVoices();
    u.voice = voices.find((v) => v.lang === "en-IN") ?? voices.find((v) => v.lang.startsWith("hi")) ?? null;
    u.rate = 0.82;
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    setPlaying(true);
    window.speechSynthesis.speak(u);
  };

  return (
    <button
      type="button"
      className={cn("say", playing && "is-playing")}
      onClick={play}
      aria-label={`Hear how to pronounce ${profile.name}`}
      data-cursor="Listen"
    >
      <span className="say__bars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <i key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </span>
    </button>
  );
}
