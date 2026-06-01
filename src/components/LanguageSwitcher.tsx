import { useEffect, useState } from "react";

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

const SCRIPT_ID = "google-translate-script";

function getCurrentLang(): "es" | "en" {
  if (typeof document === "undefined") return "es";
  const match = document.cookie.match(/googtrans=\/[^/]+\/(\w+)/);
  return match && match[1] === "en" ? "en" : "es";
}

function clearGoogtransCookies() {
  const domain = window.location.hostname;
  const parts = domain.split(".");
  const root = parts.length > 1 ? "." + parts.slice(-2).join(".") : domain;
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `googtrans=;path=/;${expire}`;
  document.cookie = `googtrans=;path=/;domain=${domain};${expire}`;
  document.cookie = `googtrans=;path=/;domain=${root};${expire}`;
}

function setGoogtransCookies(value: string) {
  const domain = window.location.hostname;
  const parts = domain.split(".");
  const root = parts.length > 1 ? "." + parts.slice(-2).join(".") : domain;
  document.cookie = `googtrans=${value};path=/`;
  document.cookie = `googtrans=${value};path=/;domain=${domain}`;
  document.cookie = `googtrans=${value};path=/;domain=${root}`;
}

function triggerTranslate(lang: "es" | "en") {
  // Try to drive the hidden Google Translate <select> directly — most reliable
  const select = document.querySelector<HTMLSelectElement>(
    "select.goog-te-combo"
  );
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event("change"));
    return true;
  }
  return false;
}

function setLang(lang: "es" | "en") {
  clearGoogtransCookies();
  if (lang === "en") {
    setGoogtransCookies("/es/en");
  }
  // Always reload — Google Translate reads the cookie on load and
  // applies (or removes) the translation reliably.
  window.location.reload();
}

export function LanguageSwitcher() {
  const [lang, setLangState] = useState<"es" | "en">("es");

  useEffect(() => {
    setLangState(getCurrentLang());

    if (document.getElementById(SCRIPT_ID)) return;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "es",
            includedLanguages: "en,es",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const next: "es" | "en" = lang === "es" ? "en" : "es";
  const label = next === "en" ? "EN" : "ES";
  const aria =
    next === "en" ? "Switch to English" : "Cambiar a español";

  return (
    <>
      {/* Hidden mount point required by the Google Translate widget */}
      <div
        id="google_translate_element"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
          left: -9999,
        }}
      />
      <button
        type="button"
        onClick={() => setLang(next)}
        aria-label={aria}
        className="fixed bottom-24 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-background border border-border text-foreground font-semibold text-sm hover:scale-110 transition-transform"
      >
        {label}
      </button>
    </>
  );
}