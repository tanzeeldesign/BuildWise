import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import floorPlanImage from "@/assets/floor-plan-trans.png";

type FloorPlanViewerProps = {
  open: boolean;
  onClose: () => void;
};

const MIN_SCALE = 1;
const MAX_SCALE = 4;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function saveFloorPlanToGallery() {
  const a = document.createElement("a");
  a.href = floorPlanImage;
  a.download = "buildwise-floor-plan.png";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function FloorPlanZoomFrame() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [gesturing, setGesturing] = useState(false);
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchStartRef = useRef<{ dist: number; scale: number } | null>(null);
  const panStartRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const lastTapRef = useRef(0);

  const sync = useCallback((nextScale: number, nextOffset: { x: number; y: number }) => {
    const s = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    const o = s <= 1 ? { x: 0, y: 0 } : nextOffset;
    scaleRef.current = s;
    offsetRef.current = o;
    setScale(s);
    setOffset(o);
  }, []);

  const zoomAt = useCallback(
    (clientX: number, clientY: number, nextScale: number) => {
      const frame = frameRef.current;
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      const cx = clientX - rect.left - rect.width / 2;
      const cy = clientY - rect.top - rect.height / 2;
      const prev = scaleRef.current;
      const s = clamp(nextScale, MIN_SCALE, MAX_SCALE);
      const ratio = s / prev;
      sync(s, {
        x: cx - (cx - offsetRef.current.x) * ratio,
        y: cy - (cy - offsetRef.current.y) * ratio,
      });
    },
    [sync],
  );

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      zoomAt(e.clientX, e.clientY, scaleRef.current * delta);
    };
    frame.addEventListener("wheel", onWheel, { passive: false });
    return () => frame.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (e: ReactPointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setGesturing(true);

    if (pointersRef.current.size === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < 280) {
        lastTapRef.current = 0;
        setGesturing(false);
        if (scaleRef.current > 1.05) {
          sync(1, { x: 0, y: 0 });
        } else {
          zoomAt(e.clientX, e.clientY, 2.25);
        }
        return;
      }
      lastTapRef.current = now;
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        ox: offsetRef.current.x,
        oy: offsetRef.current.y,
      };
      pinchStartRef.current = null;
    } else if (pointersRef.current.size === 2) {
      panStartRef.current = null;
      const pts = [...pointersRef.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartRef.current = { dist, scale: scaleRef.current };
    }
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2 && pinchStartRef.current) {
      const pts = [...pointersRef.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      const next = pinchStartRef.current.scale * (dist / Math.max(pinchStartRef.current.dist, 1));
      zoomAt(midX, midY, next);
      return;
    }

    if (pointersRef.current.size === 1 && panStartRef.current && scaleRef.current > 1) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      sync(scaleRef.current, {
        x: panStartRef.current.ox + dx,
        y: panStartRef.current.oy + dy,
      });
    }
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchStartRef.current = null;
    if (pointersRef.current.size === 0) {
      panStartRef.current = null;
      setGesturing(false);
    }
    if (pointersRef.current.size === 1) {
      const [pt] = pointersRef.current.values();
      panStartRef.current = {
        x: pt.x,
        y: pt.y,
        ox: offsetRef.current.x,
        oy: offsetRef.current.y,
      };
    }
  };

  return (
    <div
      ref={frameRef}
      className="@container flex min-h-0 flex-1 touch-none items-center justify-center overflow-hidden"
      style={{ cursor: scale > 1 ? "grab" : "zoom-in" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={floorPlanImage}
        alt="Sample residential floor plan"
        draggable={false}
        className="origin-center select-none"
        style={{
          height: "min(100%, 100cqw)",
          width: "auto",
          maxWidth: "min(780px, 100cqh)",
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale}) rotate(90deg)`,
          transition: gesturing ? undefined : "transform 160ms ease-out",
        }}
      />
    </div>
  );
}

export function FloorPlanViewer({ open, onClose }: FloorPlanViewerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-stretch justify-center md:items-center md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="floor-plan-viewer-title"
    >
      <div className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden md:h-[min(844px,calc(100dvh-4rem))] md:rounded-[2.25rem]">
        <button
          type="button"
          aria-label="Close floor plan"
          className="absolute inset-0"
          style={{
            background: "rgba(255, 255, 255, 1)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
          onClick={onClose}
        />

        <h2 id="floor-plan-viewer-title" className="sr-only">
          Floor plan
        </h2>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col px-3 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <FloorPlanZoomFrame key={open ? "open" : "closed"} />

          <div
            className="mt-3 flex shrink-0 gap-2.5 pb-[max(0.25rem,env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 flex-1 gap-2 rounded-full border-border bg-white px-4 text-[15px] font-semibold text-foreground shadow-sm hover:bg-white"
              onClick={saveFloorPlanToGallery}
            >
              <Upload className="size-4" strokeWidth={2.25} aria-hidden />
              Save to Gallery
            </Button>
            <Button
              type="button"
              size="lg"
              className="h-12 flex-1 rounded-full px-4 text-[15px] font-semibold"
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
