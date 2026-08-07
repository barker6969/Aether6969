export type PlatformId = "mtk" | "qualcomm" | "samsung" | "iphone";

export type ActionDef = {
  key: string;
  label: string;
  cost: string;
  danger?: boolean;
  desc: string;
  /** Live USB requires desktop CLI */
  desktopOnly?: boolean;
};

export const PLATFORMS: {
  id: PlatformId;
  title: string;
  subtitle: string;
  actions: ActionDef[];
}[] = [
  {
    id: "mtk",
    title: "MediaTek",
    subtitle: "BROM · Download Agent · Aegis Unlock free",
    actions: [
      {
        key: "bypass_frp",
        label: "Aegis Unlock",
        cost: "Free",
        desc: "BROM · clear Google post-reset guard without full reflash",
        desktopOnly: true,
      },
      {
        key: "read_frp_token",
        label: "Read Aegis Token",
        cost: "3 Credits",
        desc: "Extract account-guard token blob for audit",
        desktopOnly: true,
      },
      {
        key: "repair_imei",
        label: "Repair IMEI",
        cost: "5 Credits",
        desc: "Write OEM IMEI to modem NV (authorized restore only)",
        desktopOnly: true,
      },
      {
        key: "unlock_bootloader",
        label: "Unlock Bootloader",
        cost: "10 Credits",
        danger: true,
        desc: "Destructive — erases userdata",
        desktopOnly: true,
      },
      {
        key: "boot_repair",
        label: "Boot Repair",
        cost: "10 Credits",
        desc: "Reflash matching boot image from DB",
        desktopOnly: true,
      },
    ],
  },
  {
    id: "qualcomm",
    title: "Qualcomm",
    subtitle: "EDL 9008 · Sahara / Firehose",
    actions: [
      {
        key: "enter_edl",
        label: "Enter EDL",
        cost: "Free",
        desc: "Reboot to QDLoader 9008 when possible",
        desktopOnly: true,
      },
      {
        key: "bypass_frp",
        label: "Aegis Unlock",
        cost: "Free",
        desc: "EDL · clear post-reset account guard",
        desktopOnly: true,
      },
      {
        key: "repair_imei",
        label: "Repair IMEI",
        cost: "5 Credits",
        desc: "NV write over Firehose",
        desktopOnly: true,
      },
      {
        key: "carrier_unlock",
        label: "Carrier Unlock",
        cost: "12 Credits",
        desc: "SIM lock NV patch (authorized)",
        desktopOnly: true,
      },
    ],
  },
  {
    id: "samsung",
    title: "Samsung",
    subtitle: "Download Mode · Heimdall · Knox limits",
    actions: [
      {
        key: "samsung_detect",
        label: "Detect Device",
        cost: "Free",
        desc: "Heimdall handshake in Download Mode",
        desktopOnly: true,
      },
      {
        key: "bypass_frp",
        label: "Aegis Unlock",
        cost: "20 Credits",
        desc: "Clear Google guard after reset (S9 / Note 9 class)",
        desktopOnly: true,
      },
      {
        key: "samsung_factory_reset",
        label: "Factory Reset",
        cost: "15 Credits",
        danger: true,
        desc: "Erase USERDATA via Heimdall",
        desktopOnly: true,
      },
      {
        key: "samsung_read_pit",
        label: "Read PIT",
        cost: "Free",
        desc: "Dump partition information table",
        desktopOnly: true,
      },
    ],
  },
  {
    id: "iphone",
    title: "iPhone",
    subtitle: "Diagnostics · official restore path",
    actions: [
      {
        key: "read_info",
        label: "Modern Diagnostic",
        cost: "20 Credits",
        desc: "Hardware fingerprint (desktop USB)",
        desktopOnly: true,
      },
      {
        key: "icloud_check",
        label: "Activation Probe",
        cost: "5 Credits",
        desc: "Activation Lock status (read-only)",
        desktopOnly: true,
      },
      {
        key: "apple_detect",
        label: "DFU / Recovery Detect",
        cost: "Free",
        desc: "USB mode check — restore via Finder / Apple Devices",
        desktopOnly: true,
      },
      {
        key: "trust_audit",
        label: "Trust Cache Audit",
        cost: "10 Credits",
        desc: "SecureROM signature compare",
        desktopOnly: true,
      },
    ],
  },
];

export const DOCS = [
  {
    slug: "mtk-aegis",
    title: "MTK BROM — Aegis Unlock",
    platform: "MediaTek",
    summary: "Clear post-reset Google guard over BROM. Free on paid plans.",
    body: `Aegis Unlock is Aether’s name for clearing the Android post-reset Google account guard on MediaTek devices via BROM.

1. Power off · hold Vol- · plug USB (BROM).
2. On desktop: MTK Service → Aegis Unlock.
3. Reboot and complete setup.

CLI: aether-cli bypass-frp auto

Mobile is a companion — live BROM needs the desktop app + aether-cli.`,
  },
  {
    slug: "samsung-aegis",
    title: "Samsung — Aegis Unlock",
    platform: "Samsung",
    summary: "Download Mode · best on S9 / Note 9 class.",
    body: `Use Download Mode + Heimdall on the desktop suite.

Knox 3.x (S10+) may reject writes. S23+ not supported in Aether.

This is not Knox Guard permanent removal and not iPhone passcode unlock.`,
  },
  {
    slug: "desktop",
    title: "Desktop + CLI",
    platform: "All",
    summary: "USB repair runs on the workstation.",
    body: `Install desktop from GitHub Releases (MSI / DMG / AppImage).

Run: aether-cli devices | apple-detect | serve

WebSocket bridge: ws://127.0.0.1:8765

Canonical repo: github.com/barker6969/Aether6969`,
  },
];

export const DESKTOP_RELEASE =
  "https://github.com/barker6969/Aether6969/releases/tag/desktop-v0.1.0";
