import * as Burnt from "burnt";
import type { ToastMessageOptions } from "@/types/toast";

export function showToast(options: ToastMessageOptions): void {
  Burnt.toast(options);
}
