/** UI action key → aether-cli bridge JSON-RPC method (matches frontend AppContext). */
export const BRIDGE_METHODS: Record<
  string,
  { method: string; params?: Record<string, unknown> }
> = {
  bypass_frp: { method: "mtk.frp_bypass" },
  repair_imei: { method: "mtk.repair_imei" },
  unlock_bootloader: { method: "mtk.unlock_bootloader" },
  erase_userdata: { method: "mtk.erase_userdata" },
  read_info: { method: "mtk.read_info" },
  enter_edl: { method: "qualcomm.enter_edl" },
  samsung_detect: { method: "samsung.detect" },
  samsung_read_pit: { method: "samsung.read_pit" },
  samsung_factory_reset: { method: "samsung.factory_reset" },
};

export const DEFAULT_BRIDGE_HOST = "127.0.0.1";
export const DEFAULT_BRIDGE_PORT = "8765";

export function buildBridgeUrl(host: string, port: string) {
  const h = (host || DEFAULT_BRIDGE_HOST).trim();
  const p = (port || DEFAULT_BRIDGE_PORT).trim();
  return `ws://${h}:${p}`;
}
