import type { Metadata } from "next";
import Contact from "@/components/home/Contact";
import ContactForm from "@/components/pages/ContactForm";
import SectionLabel from "@/components/home/SectionLabel";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Contact",
  description: `Start a conversation with ${profile.name}.`,
};

export default function ContactPage() {
  return (
    <div className="contact-page">
      <p className="wrap ph__meta mono contact-page__meta">
        <span>
          <span className="blue">Sheet A-09</span>
          <span className="mute"> · Contact</span>
        </span>
        <span className="mute">{profile.replyTime}</span>
      </p>
      <Contact standalone />
      <section className="section--tight">
        <div className="wrap">
          <SectionLabel num="02" title="Project form" right="Opens your mail app, pre-filled" />
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
