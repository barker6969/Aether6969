from __future__ import annotations

import shutil
import subprocess
from dataclasses import dataclass


class AdbError(RuntimeError):
    pass


def adb_bin() -> str:
    path = shutil.which("adb")
    if not path:
        raise AdbError("adb not found on PATH — install platform-tools")
    return path


def run_adb(*args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    cmd = [adb_bin(), *args]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if check and proc.returncode != 0:
        raise AdbError(proc.stderr.strip() or proc.stdout.strip() or f"adb failed: {args}")
    return proc


@dataclass
class Device:
    serial: str
    state: str
    product: str = ""
    model: str = ""
    device: str = ""


def list_devices() -> list[Device]:
    proc = run_adb("devices", "-l", check=False)
    devices: list[Device] = []
    for line in proc.stdout.splitlines()[1:]:
        line = line.strip()
        if not line:
            continue
        parts = line.split()
        if len(parts) < 2:
            continue
        serial, state = parts[0], parts[1]
        meta = {}
        for p in parts[2:]:
            if ":" in p:
                k, v = p.split(":", 1)
                meta[k] = v
        devices.append(
            Device(
                serial=serial,
                state=state,
                product=meta.get("product", ""),
                model=meta.get("model", ""),
                device=meta.get("device", ""),
            )
        )
    return devices


def shell(serial: str | None, *cmd: str) -> str:
    args = []
    if serial:
        args.extend(["-s", serial])
    args.append("shell")
    args.extend(cmd)
    return run_adb(*args).stdout


def install_apk(apk: str, serial: str | None = None, replace: bool = True) -> str:
    args = []
    if serial:
        args.extend(["-s", serial])
    if replace:
        args.append("install")
        args.append("-r")
    else:
        args.append("install")
    args.append(apk)
    return run_adb(*args).stdout


def push(local: str, remote: str, serial: str | None = None) -> str:
    args = []
    if serial:
        args.extend(["-s", serial])
    args.extend(["push", local, remote])
    return run_adb(*args).stdout


def pull(remote: str, local: str, serial: str | None = None) -> str:
    args = []
    if serial:
        args.extend(["-s", serial])
    args.extend(["pull", remote, local])
    return run_adb(*args).stdout


def start_activity(component: str, serial: str | None = None) -> str:
    args = []
    if serial:
        args.extend(["-s", serial])
    args.extend(["shell", "am", "start", "-n", component])
    return run_adb(*args).stdout
