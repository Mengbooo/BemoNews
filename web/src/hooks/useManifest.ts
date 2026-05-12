import { useEffect, useState } from "react";
import { apiClient } from "@/api/client";
import type { Manifest } from "@/types";

export function useManifest() {
  const [data, setData] = useState<Manifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    apiClient
      .getManifest()
      .then((manifest) => {
        if (!alive) return;
        setData(manifest);
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
  }, []);

  return { data, loading, error };
}
