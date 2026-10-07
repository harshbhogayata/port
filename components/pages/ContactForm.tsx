"use client";

import { useState } from "react";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { cn } from "@/lib/utils";

const REASONS = ["A full-time role", "A freelance project", "A collaboration", "Just saying hello"];

/** No backend needed: composes a pre-filled email. Swap for an API route when one exists. */
export default function ContactForm() {
  const [reason, setReason] = useState(REASONS[0]);
  const [about, setAbout] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <form
      className="cform"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        if (f.get("company")) return; // honeypot
        const name = String(f.get("name") || "").trim();
        const msg = String(f.get("message") || "").trim();
        const subject = `${reason}${about ? ` · about ${about}` : ""}${name ? ` · from ${name}` : ""}`;
        const body = `${msg}\n\n— ${name}\n${String(f.get("email") || "")}`;
        window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSent(true);
      }}
    >
      <fieldset className="cform__set">
        <legend className="mono mute">01 · I&rsquo;m reaching out about</legend>
        <div className="cform__chips">
          {REASONS.map((r) => (
            <button key={r} type="button" className={cn("chip", reason === r && "is-on")} aria-pressed={reason === r} onClick={() => setReason(r)}>
              {r}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="cform__set">
        <legend className="mono mute">02 · Related to a project? (optional)</legend>
        <div className="cform__chips">
          {projects.map((p) => (
            <button
              key={p.slug}
              type="button"
              className={cn("chip", about === p.title && "is-on")}
              aria-pressed={about === p.title}
              onClick={() => setAbout(about === p.title ? "" : p.title)}
            >
              {p.title}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="cform__row">
        <label className="field">
          <span className="mono mute">03 · Your name</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label className="field">
          <span className="mono mute">04 · Your email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <label className="field">
        <span className="mono mute">05 · What are you building?</span>
        <textarea name="message" rows={5} required />
      </label>
      <label className="cform__hp" aria-hidden="true">
        Company
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="cform__foot">
        <button type="submit" className="btn">
          {sent ? "Opened in your mail app" : "Send message"} <span className="arrow">→</span>
        </button>
        <p className="mono mute">{profile.replyTime}</p>
      </div>
    </form>
  );
}
