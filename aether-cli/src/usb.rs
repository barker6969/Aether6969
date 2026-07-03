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
fn classify(desc: &DeviceDescriptor) -> Option<&'static str> {
    match (desc.vendor_id(), desc.product_id()) {
        // MediaTek BROM / Preloader
        (0x0e8d, 0x2000) | (0x0e8d, 0x0003) => Some("MediaTek BROM / Preloader"),
        // Qualcomm EDL 9008 / Sahara
        (0x05c6, 0x9008) => Some("Qualcomm EDL 9008 (Sahara)"),
        (0x05c6, 0x900e) => Some("Qualcomm Diag"),
        // Apple DFU / Recovery
        (0x05ac, 0x1227) => Some("Apple DFU mode"),
        (0x05ac, 0x1281) => Some("Apple Recovery mode"),
        // Samsung Download mode
        (0x04e8, 0x685d) => Some("Samsung Download mode"),
        _ => None,
    }
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
