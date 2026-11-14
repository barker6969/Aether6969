from __future__ import annotations

from pathlib import Path


def host_root() -> Path:
    """MapleHost package root (folder containing pyproject.toml)."""
    return Path(__file__).resolve().parent.parent


def mapleroot_dir() -> Path:
    """Sibling mapleroot/ Android tree next to maplehost/."""
    sibling = host_root().parent / "mapleroot"
    if sibling.is_dir():
        return sibling
    import os
    env = os.environ.get("MAPLEROOT_DIR")
    if env:
        return Path(env)
    return sibling


def repo_root() -> Path:
    """Android project root (mapleroot). Used by build/deploy commands."""
    return mapleroot_dir()


def app_dir() -> Path:
    return mapleroot_dir() / "app"


def assets_dir() -> Path:
    return app_dir() / "src" / "main" / "assets" / "arm64-v8a"


def lkm_dir() -> Path:
    return mapleroot_dir() / "lkm"


def scripts_dir() -> Path:
    return mapleroot_dir() / "scripts"


def docs_dir() -> Path:
    return mapleroot_dir() / "docs"


def contract_path() -> Path:
    return mapleroot_dir() / "contract.json"
