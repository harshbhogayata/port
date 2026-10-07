"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { useNavigate } from "./Transition";
import { isExternal } from "@/lib/utils";

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  cursor?: string;
};

/** Internal link that plays the drafting transition. External links behave normally. */
const TLink = forwardRef<HTMLAnchorElement, Props>(function TLink({ href, cursor, onClick, children, ...rest }, ref) {
  const navigate = useNavigate();

  if (isExternal(href) || href === "#") {
    const ext = href.startsWith("http");
    return (
      <a
        ref={ref}
        href={href}
        data-cursor={cursor}
        {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      ref={ref}
      href={href}
      data-cursor={cursor}
      scroll={false}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
});

export default TLink;
