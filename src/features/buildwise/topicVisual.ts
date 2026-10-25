import {
  BrickWall,
  Compass,
  LayoutTemplate,
  Palette,
  Sun,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { TopicId } from "./types";

export const topicVisual: Record<
  TopicId,
  { icon: LucideIcon; tint: string; chip: string; glow: string }
> = {
  orientation: {
    icon: Compass,
    tint: "from-[#E8F0E6] to-[#D5E4D2]",
    chip: "bg-[#D7E8D4] text-[#2F5A3C]",
    glow: "bg-[#3D6B4F]/12",
  },
  ventilation: {
    icon: Wind,
    tint: "from-[#E4F1F0] to-[#CEE6E4]",
    chip: "bg-[#D0EAE7] text-[#1F5C56]",
    glow: "bg-[#2A7A72]/12",
  },
  sunlight: {
    icon: Sun,
    tint: "from-[#F7F0E0] to-[#F0E0C0]",
    chip: "bg-[#F3E4C0] text-[#7A5A18]",
    glow: "bg-[#C9962A]/14",
  },
  materials: {
    icon: BrickWall,
    tint: "from-[#F3E8E2] to-[#E8D5C8]",
    chip: "bg-[#EBD9CC] text-[#6B4330]",
    glow: "bg-[#A66B4A]/12",
  },
  spatial: {
    icon: LayoutTemplate,
    tint: "from-[#E8ECF3] to-[#D5DCE8]",
    chip: "bg-[#D8E0EC] text-[#31486A]",
    glow: "bg-[#4A6488]/12",
  },
  "design-direction": {
    icon: Palette,
    tint: "from-[#ECE8F0] to-[#DDD6E8]",
    chip: "bg-[#E2DAEC] text-[#4A3A66]",
    glow: "bg-[#6B568C]/12",
  },
};
