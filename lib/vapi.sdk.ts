import Vapi from "@vapi-ai/web";
import { patchConsoleToDailySuppressErrors } from "./suppressDailyErrors";

// Suppress Daily.js "Meeting ended" errors before Vapi initializes
if (typeof window !== "undefined") {
  patchConsoleToDailySuppressErrors();
}

export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);