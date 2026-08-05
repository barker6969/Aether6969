import React, { useState, useEffect } from "react";
import { Download, X, Monitor, Apple, Cpu, ExternalLink } from "lucide-react";
import {
  DESKTOP_VERSION as VERSION,
  DESKTOP_RELEASES_BASE as RELEASES_BASE,
  DESKTOP_ASSETS,
} from "../lib/releases";

const STORAGE_KEY = "aether.hero.getDesktop.dismissed";

const BUILDS = [
  {
    key: "windows-x64",
    label: "Windows",
    sub: ".msi · x64",
    file: DESKTOP_ASSETS.windows,
    icon: Monitor,
  },
  {
    key: "macos-universal",
    label: "macOS",
    sub: ".dmg · Universal",
    file: DESKTOP_ASSETS.macos,
    icon: Apple,
  },
  {
    key: "linux-x64",
    label: "Linux",
    sub: ".AppImage · x64",
    file: DESKTOP_ASSETS.linux,
    icon: Monitor,
  },
];

const ScanLineOverlay = () => (
  <div
    className="absolute inset-0 opacity-[0.04] pointer-events-none"
    style={{
      backgroundImage:
        "repeating-linear-gradient(0deg, rgba(0,255,65,0.5) 0px, rgba(0,255,65,0.5) 1px, transparent 1px, transparent 3px)",
    }}
  />
);

const HeroInfo = () => (
  <div className="flex items-start md:items-center gap-3 md:gap-5 flex-1 min-w-0">
    <div className="hidden sm:flex w-11 h-11 md:w-12 md:h-12 border border-[#00FF41]/40 bg-black flex-shrink-0 items-center justify-center">
      <Cpu className="w-5 h-5 md:w-6 md:h-6 text-[#00FF41]" />
    </div>

    <div className="flex-1 min-w-0 pr-8 md:pr-0">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
        <span className="font-mono text-[9px] tracking-[0.32em] uppercase text-[#00FF41]/80 whitespace-nowrap">
          Native build · v{VERSION} · live
        </span>
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/30 whitespace-nowrap">
          Tauri 2 · WebView2
        </span>
      </div>
      <h3 className="font-mono text-sm tracking-[0.2em] uppercase text-white mb-1">
        Aether Desktop is ready
      </h3>
      <p className="font-mono text-[11px] text-white/60 leading-relaxed">
        Native installer talks to MTK BROM, Qualcomm Sahara / Firehose, Apple DFU and Samsung KG
        directly over USB — no browser, no bridge process. Pick your platform below.
      </p>
    </div>
  </div>
);

const DownloadButtons = () => {
  const handleDownload = (b) => {
    const url = `${RELEASES_BASE}/${b.file}`;
    window.open(url, "_blank", "noopener");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-1.5 flex-shrink-0">
      {BUILDS.map((b) => {
        const Icon = b.icon;
        return (
          <button
            key={b.key}
            data-testid={`get-desktop-hero-download-${b.key}`}
            onClick={() => handleDownload(b)}
            className="h-9 px-3 bg-[#00FF41] hover:bg-[#00CC33] text-black font-mono text-[11px] tracking-[0.18em] uppercase font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{b.label}</span>
            <span className="opacity-70 text-[10px] normal-case tracking-normal">{b.sub}</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </button>
        );
      })}
    </div>
  );
};

export const GetDesktopHeroCard = () => {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch (e) {
      console.debug("[GetDesktopHeroCard] localStorage read blocked:", e);
      setDismissed(false);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch (e) {
      console.debug("[GetDesktopHeroCard] localStorage write blocked:", e);
    }
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div
      data-testid="get-desktop-hero"
      className="relative overflow-hidden bg-gradient-to-br from-[#00FF41]/[0.06] via-transparent to-transparent border border-[#00FF41]/30"
    >
      <ScanLineOverlay />
      <button
        data-testid="get-desktop-hero-dismiss"
        onClick={dismiss}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors z-10"
        title="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="relative px-4 py-4 md:px-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-5">
        <HeroInfo />
        <DownloadButtons />
      </div>

      <div className="relative px-4 pb-3 md:px-5 flex items-center gap-3 justify-center md:justify-start font-mono text-[10px] tracking-[0.18em] uppercase text-white/30">
        <Download className="w-3 h-3" />
        <span>Direct from GitHub Releases · unsigned builds may show SmartScreen / Gatekeeper</span>
      </div>
    </div>
  );
};
