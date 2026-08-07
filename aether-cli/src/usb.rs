//! USB enumeration + hot-plug watching via `rusb`.
//!
//! Real and functional — talks to libusb on the host. On machines without a
//! USB subsystem (Docker containers, headless CI) `libusb_init` fails; instead
//! of panicking or bubbling an error, we degrade gracefully to an empty device
//! list so `aether-cli devices` / the bridge stay usable everywhere.

use anyhow::Result;
use colored::Colorize;
use rusb::{Context, Device, DeviceDescriptor, UsbContext};
use serde_json::{json, Value};
use std::time::Duration;

/// Create a libusb context, returning `None` when no USB subsystem is available
/// (Docker/headless CI). Never panics.
fn usb_context() -> Option<Context> {
    match Context::new() {
        Ok(ctx) => Some(ctx),
        Err(e) => {
            tracing::debug!("libusb unavailable ({e}) — USB features disabled on this host");
            None
        }
    }
}

/// Enumerate attached USB devices as (device, descriptor) pairs. Returns an
/// empty vec on hosts without USB — never panics, never errors.
fn enumerate() -> Vec<(Device<Context>, DeviceDescriptor)> {
    let Some(ctx) = usb_context() else {
        return Vec::new();
    };
    let list = match ctx.devices() {
        Ok(l) => l,
        Err(e) => {
            tracing::debug!("libusb device enumeration failed: {e}");
            return Vec::new();
        }
    };
    let mut out = Vec::new();
    for d in list.iter() {
        if let Ok(desc) = d.device_descriptor() {
            out.push((d, desc));
        }
    }
    out
}

/// Pretty-print a single USB device row.
fn fmt_device<T: UsbContext>(d: &Device<T>, desc: &DeviceDescriptor) -> String {
    let vid = desc.vendor_id();
    let pid = desc.product_id();
    let bus = d.bus_number();
    let addr = d.address();
    let class = format!("{:?}", desc.class_code());
    let manufacturer = d
        .open()
        .ok()
        .and_then(|h| h.read_manufacturer_string_ascii(desc).ok())
        .unwrap_or_else(|| "—".into());
    let product = d
        .open()
        .ok()
        .and_then(|h| h.read_product_string_ascii(desc).ok())
        .unwrap_or_else(|| "—".into());
    format!(
        "  bus {:>3} · addr {:>3} | {:04x}:{:04x} | {:<12} | {} {}",
        bus, addr, vid, pid, class, manufacturer.dimmed(), product
    )
}

/// Match a USB device against known repair-mode signatures.
///
/// Apple (VID 0x05ac) DFU / Recovery PIDs vary by model and iOS generation.
/// Detection only — no unlock, no passcode bypass. Official erase/restore is
/// done via Finder / Apple Devices / iTunes once Recovery or DFU is visible.
fn classify(desc: &DeviceDescriptor) -> Option<&'static str> {
    match (desc.vendor_id(), desc.product_id()) {
        // MediaTek BROM / Preloader
        (0x0e8d, 0x2000) | (0x0e8d, 0x0003) => Some("MediaTek BROM / Preloader"),
        // Qualcomm EDL 9008 / Sahara
        (0x05c6, 0x9008) => Some("Qualcomm EDL 9008 (Sahara)"),
        (0x05c6, 0x900e) => Some("Qualcomm Diag"),
        // Apple DFU (common across many iPhone / iPad generations)
        (0x05ac, 0x1227) => Some("Apple DFU mode"),
        // Apple Recovery Mode (several PIDs used across models)
        (0x05ac, 0x1281) | (0x05ac, 0x1283) | (0x05ac, 0x1222) => Some("Apple Recovery mode"),
        // Apple mobile device in normal / restore-capable mode (not DFU)
        (0x05ac, 0x12a8) | (0x05ac, 0x12ab) => Some("Apple device (normal / restore)"),
        // Samsung Download mode
        (0x04e8, 0x685d) => Some("Samsung Download mode"),
        _ => None,
    }
}

fn is_apple_mode(tag: &str) -> bool {
    tag.starts_with("Apple ")
}

/// JSON representation of the current USB device list — used by the bridge.
pub fn devices_as_json() -> Result<Vec<Value>> {
    let mut out = Vec::new();
    for (d, desc) in enumerate() {
        out.push(json!({
            "bus": d.bus_number(),
            "addr": d.address(),
            "vid": format!("{:04x}", desc.vendor_id()),
            "pid": format!("{:04x}", desc.product_id()),
            "repair_mode": classify(&desc),
        }));
    }
    Ok(out)
}

pub fn list_devices() -> Result<()> {
    let devices = enumerate();
    let mut shown = 0;
    let mut repair_targets = 0;
    for (d, desc) in &devices {
        shown += 1;
        let line = fmt_device(d, desc);
        if let Some(tag) = classify(desc) {
            repair_targets += 1;
            println!("{}", format!("{}  ← {}", line, tag).bright_green().bold());
        } else {
            println!("{}", line);
        }
    }
    println!();
    println!(
        "  {} {} USB devices · {} repair-mode targets detected.",
        "→".bright_green(),
        shown,
        repair_targets,
    );
    if shown == 0 {
        println!(
            "  {}",
            "No USB subsystem detected (or no devices attached). On a real \
             technician machine, plug in a device in BROM / EDL / DFU / Download mode."
                .dimmed()
        );
    } else if repair_targets == 0 {
        println!(
            "  {}",
            "Plug in a device in BROM / EDL / DFU / Download mode and retry.".dimmed()
        );
    }
    Ok(())
}

/// Detect Apple devices in DFU / Recovery / normal USB mode.
///
/// Detection only — does not unlock, bypass passcode, or flash firmware.
/// Forgotten-passcode recovery is Apple's official Restore (erases the device):
/// Finder on macOS, or Apple Devices / iTunes on Windows.
pub fn detect_apple() -> Result<()> {
    println!(
        "  {} {}",
        "→".bright_green(),
        "Apple DFU / Recovery detection (USB only — no unlock)".bright_white().bold()
    );
    println!();

    let devices = enumerate();
    let mut found: Vec<(String, &'static str)> = Vec::new();

    for (d, desc) in &devices {
        if let Some(tag) = classify(desc) {
            if is_apple_mode(tag) {
                found.push((fmt_device(d, desc), tag));
            }
        }
    }

    if found.is_empty() {
        println!(
            "  {} {}",
            "○".yellow(),
            "No Apple device in DFU, Recovery, or restore USB mode."
        );
        println!();
        println!("{}", "  How to put an iPhone into Recovery or DFU (authorized device only):".dimmed());
        println!("{}", "    1. Use a data-capable USB cable (not charge-only).".dimmed());
        println!("{}", "    2. Recovery: follow Apple's button sequence for your model until".dimmed());
        println!("{}", "       the cable/computer icon appears.".dimmed());
        println!("{}", "    3. DFU: follow Apple's DFU sequence for your model (screen stays black).".dimmed());
        println!("{}", "    4. Re-run:  aether-cli apple-detect".dimmed());
        println!();
        println!(
            "  {}",
            "Host tip: Windows needs Apple USB drivers (Apple Devices / iTunes).".dimmed()
        );
        return Ok(());
    }

    for (line, tag) in &found {
        println!("{}", format!("{}  ← {}", line, tag).bright_green().bold());
    }

    println!();
    println!(
        "  {} {} Apple USB target(s) detected.",
        "✓".bright_green(),
        found.len()
    );
    println!();
    println!("{}", "  Next step — forgotten passcode (official erase only):".bright_white());
    println!(
        "{}",
        "    • macOS: open Finder → select the iPhone → Restore".dimmed()
    );
    println!(
        "{}",
        "    • Windows: open Apple Devices (or iTunes) → Restore".dimmed()
    );
    println!(
        "{}",
        "    • Restore downloads a signed IPSW from Apple and wipes the device.".dimmed()
    );
    println!(
        "{}",
        "    • If Find My / Activation Lock is on, Apple ID credentials (or".dimmed()
    );
    println!(
        "{}",
        "      Apple Support + proof of purchase) are still required after erase.".dimmed()
    );
    println!();
    println!(
        "  {}",
        "Aether does not remove passcodes or bypass Activation Lock."
            .yellow()
    );

    Ok(())
}

pub async fn watch_hotplug() -> Result<()> {
    println!(
        "  {} watching for hot-plug events ... (Ctrl-C to stop)",
        "○".bright_green()
    );
    let mut last = collect_keys();
    loop {
        tokio::time::sleep(Duration::from_millis(750)).await;
        let now = collect_keys();
        for k in now.difference(&last) {
            println!("  {} attached  {}", "+".bright_green().bold(), k);
        }
        for k in last.difference(&now) {
            println!("  {} detached  {}", "-".red().bold(), k);
        }
        last = now;
    }
}

fn collect_keys() -> std::collections::HashSet<String> {
    let mut out = std::collections::HashSet::new();
    for (d, desc) in enumerate() {
        out.insert(format!(
            "{:04x}:{:04x} bus{}.addr{}",
            desc.vendor_id(),
            desc.product_id(),
            d.bus_number(),
            d.address()
        ));
    }
    out
}
