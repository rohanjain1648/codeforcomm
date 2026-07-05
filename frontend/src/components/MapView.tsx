// Google Maps Platform hotspot view — district markers colored by dry-spell
// alert level. Degrades to a clear "add a key" placeholder when
// VITE_GOOGLE_MAPS_API_KEY isn't set, so the dashboard never breaks.
import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import type { AlertLevel, DistrictPoint } from "../lib/api";

const LEVEL_COLOR: Record<AlertLevel, string> = {
  green: "#0ca30c",
  amber: "#fab219",
  red: "#d03b3b",
};

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

let loaderPromise: Promise<typeof google.maps> | null = null;
function loadMaps(): Promise<typeof google.maps> {
  if (!loaderPromise) {
    const loader = new Loader({ apiKey: API_KEY!, version: "weekly" });
    loaderPromise = loader.importLibrary("maps").then(() => google.maps);
  }
  return loaderPromise;
}

export default function MapView({
  points, center,
}: { points: DistrictPoint[]; center?: { lat: number; lng: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!API_KEY) {
      setError("no-key");
      return;
    }
    if (!ref.current) return;
    let cancelled = false;

    loadMaps()
      .then((maps) => {
        if (cancelled || !ref.current) return;
        mapRef.current = new maps.Map(ref.current, {
          center: center ?? { lat: 16.5, lng: 80.0 },
          zoom: 6,
          disableDefaultUI: true,
          zoomControl: true,
        });
        renderMarkers(maps);
      })
      .catch(() => setError("load-failed"));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapRef.current && center) mapRef.current.setCenter(center);
  }, [center]);

  useEffect(() => {
    if (mapRef.current) void loadMaps().then((maps) => renderMarkers(maps));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  function renderMarkers(maps: typeof google.maps) {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = points.map((p) => {
      const marker = new maps.Marker({
        position: { lat: p.lat, lng: p.lon },
        map: mapRef.current!,
        title: `${p.district} — ${p.level}`,
        icon: {
          path: maps.SymbolPath.CIRCLE,
          fillColor: LEVEL_COLOR[p.level],
          fillOpacity: 0.9,
          strokeColor: "#ffffff",
          strokeWeight: 1,
          scale: 10,
        },
      });
      const info = new maps.InfoWindow({
        content: `<div style="color:#111"><b>${p.district}</b><br/>${p.zone}<br/>Alert: ${p.level}</div>`,
      });
      marker.addListener("click", () => info.open(mapRef.current!, marker));
      return marker;
    });
  }

  if (error) {
    return (
      <div className="card flex h-72 flex-col items-center justify-center gap-2 text-center text-sm" style={{ color: "var(--text-muted)" }}>
        <span>Map unavailable — add VITE_GOOGLE_MAPS_API_KEY to frontend/.env</span>
        <div className="flex gap-3 text-xs">
          {points.map((p) => (
            <span key={p.key} className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: LEVEL_COLOR[p.level] }} />
              {p.district}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return <div ref={ref} className="h-72 w-full rounded-2xl" style={{ border: "1px solid var(--border)" }} />;
}
