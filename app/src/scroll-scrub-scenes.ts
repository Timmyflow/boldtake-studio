import type { ScrollScrubScene, ScrollScrubTheme } from "@/components/scroll-scrub/scroll-scrub";
export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#D5FA47",
  background: "#17191A",
  ink: "#F1F2E9",
  muted: "#ADB1A9",
};
export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    id: "idea-to-frame",
    label: "Монтаж",
    title: "Монтаж",
    body: "Фрагмент предметного ролика.",
    poster: "/assets/world/process-poster.png",
    clip: "/assets/world/process.mp4",
    mobilePoster: "/assets/world/process-mobile-poster.png",
    mobileClip: "/assets/world/process-mobile.mp4",
    align: "right",
    scroll: 1.5,
    objectPosition: "30% 50%",
    mobileObjectPosition: "50% 30%",
  },
];
