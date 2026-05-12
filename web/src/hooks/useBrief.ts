import { useEffect, useState } from "react";
import { apiClient } from "@/api/client";
import type { BriefPayload, BriefType } from "@/types";

export function useBrief(date: string | undefined, type: BriefType) {
  const [data, setData] = useState<BriefPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) {
      setLoading(false);
      setError("Missing date parameter");
      return;
    }

    let alive = true;
    setLoading(true);

    apiClient
      .getBrief(date, type)
      .then((payload) => {
        if (!alive) return;
        setData(payload);
        setError(null);
      })
      .catch((err: Error) => {
        if (!alive) return;
        setError(err.message);
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, [date, type]);

  return { data, loading, error };
}
