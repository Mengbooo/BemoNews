import type { BriefPayload, GenerateResult, Manifest, SourceConfig } from "@/types";

async function readJSON<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const apiClient = {
  getManifest() {
    return readJSON<Manifest>("/api/manifest");
  },
  getBrief(date: string, type: "quick" | "full") {
    return readJSON<BriefPayload>(`/api/briefs/${date}/${type}`);
  },
  getSources() {
    return readJSON<{ sources: SourceConfig[]; count: number }>("/api/sources");
  },
  triggerGenerate(payload?: { date?: string; deliver?: boolean }) {
    return readJSON<{ ok: boolean; result: GenerateResult }>("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload ?? {}),
    });
  },
};
