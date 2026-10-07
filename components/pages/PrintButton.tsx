"use client";

export default function PrintButton() {
  return (
    <button type="button" className="link-line" onClick={() => window.print()} data-cursor="Print">
      Print this page
    </button>
  );
}
