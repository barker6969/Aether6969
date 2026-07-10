// Known USB repair-mode signatures (VID/PID). Mirrors the Rust CLI
// `usb.rs::classify()` so browser-side WebUSB detection labels devices the
// same way the native bridge does.
export const USB_SIGNATURES = [
  { vid: 0x0e8d, pid: 0x2000, platform: "MediaTek", mode: "BROM / Preloader" },
  { vid: 0x0e8d, pid: 0x0003, platform: "MediaTek", mode: "Preloader" },
  { vid: 0x05c6, pid: 0x9008, platform: "Qualcomm", mode: "EDL 9008 (Sahara)" },
  { vid: 0x05c6, pid: 0x900e, platform: "Qualcomm", mode: "Diagnostic" },
  { vid: 0x05ac, pid: 0x1227, platform: "Apple", mode: "DFU mode" },
  { vid: 0x05ac, pid: 0x1281, platform: "Apple", mode: "Recovery mode" },
  { vid: 0x04e8, pid: 0x685d, platform: "Samsung", mode: "Download mode (Odin)" },
  { vid: 0x18d1, pid: 0x4ee0, platform: "Android", mode: "Fastboot" },
  { vid: 0x18d1, pid: 0xd00d, platform: "Android", mode: "Fastboot" },
];

export const classifyUsb = (vid, pid) =>
  USB_SIGNATURES.find((s) => s.vid === vid && s.pid === pid) || null;

// Vendor filters passed to navigator.usb.requestDevice(). Covers the major
// phone makers so the browser chooser surfaces relevant devices. (Empty
// filters would list every USB device incl. hubs/keyboards — too noisy.)
export const USB_REQUEST_FILTERS = [
  { vendorId: 0x0e8d }, // MediaTek
  { vendorId: 0x05c6 }, // Qualcomm
  { vendorId: 0x05ac }, // Apple
  { vendorId: 0x04e8 }, // Samsung
  { vendorId: 0x18d1 }, // Google / generic Android
  { vendorId: 0x2717 }, // Xiaomi
  { vendorId: 0x22b8 }, // Motorola
  { vendorId: 0x1004 }, // LG
  { vendorId: 0x12d1 }, // Huawei
  { vendorId: 0x0bb4 }, // HTC / OnePlus
  { vendorId: 0x2a70 }, // OnePlus / Oppo
];
