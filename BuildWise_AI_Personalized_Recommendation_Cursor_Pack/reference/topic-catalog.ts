/*
 * Reference copy catalog for BuildWise.
 *
 * This is source material for Cursor to adapt into the existing recommendations.ts.
 * It is not guaranteed to be a drop-in replacement: import paths and existing exported
 * types must be matched to the actual repository.
 */

import type { TopicId } from "../src/features/buildwise/types";

export const topicCatalog: Record<
  TopicId,
  {
    id: TopicId;
    number: string;
    title: string;
    cardTitle: string;
    blurb: string;
    label: string;
    heroTemplate: string;
    whyTemplate: string;
    discuss: string[];
    tip: string;
    planLabel: string;
  }
> = {
  orientation: {
    id: "orientation",
    number: "01",
    title: "Orientation",
    cardTitle: "Orientation",
    blurb: "Plan your rooms around sunlight, shade, and everyday comfort.",
    label: "SITE & CLIMATE",
    heroTemplate: "Let your home's orientation work for you in {location}.",
    whyTemplate: "For your {plot} plot in {location}, orientation can influence how sunlight enters your rooms and how much heat your home absorbs. Consider local conditions, your preferred {style} design, and the needs of your {family} household before finalizing the layout.",
    discuss: [
      "How does the plot's actual direction affect sunlight and afternoon heat?",
      "Which rooms would benefit from morning light or reduced direct sun?",
      "Where could external shading improve comfort without blocking useful daylight?",
      "How can the layout respond to neighboring buildings, privacy, and available outdoor space?"
    ],
    tip: "Review the sun's path and the plot's actual orientation before fixing the room layout.",
    planLabel: "Orientation"
  },
  ventilation: {
    id: "ventilation",
    number: "02",
    title: "Ventilation",
    cardTitle: "Natural Ventilation",
    blurb: "Explore airflow, window placement, and ways to improve indoor comfort.",
    label: "CLIMATE & COMFORT",
    heroTemplate: "Make natural airflow work for your home in {location}.",
    whyTemplate: "Your selected climate condition, {climate}, makes ventilation worth considering early. In {location}, natural airflow depends on wind direction, room layout, outdoor conditions, and window placement. Plan for comfort while considering your {family} household and preferred {style} design.",
    discuss: [
      "Can window positions support cross-ventilation through frequently used rooms?",
      "How will nearby buildings and actual prevailing winds affect airflow?",
      "Where are shading, privacy, security, and insect protection also important?",
      "When might mechanical ventilation or cooling be more suitable than relying on open windows?"
    ],
    tip: "More windows do not automatically mean better ventilation. Their placement and the available airflow path matter.",
    planLabel: "Natural Ventilation"
  },
  sunlight: {
    id: "sunlight",
    number: "03",
    title: "Sunlight",
    cardTitle: "Natural Light",
    blurb: "Bring useful daylight into the spaces you use most.",
    label: "LIGHT & WELLBEING",
    heroTemplate: "Bring natural light into the everyday spaces of your {style} home.",
    whyTemplate: "Your preference for {style} design and interest in natural light make daylight an important planning consideration. In {location}, plot orientation, surrounding buildings, window positions, and shading influence how light reaches rooms. Consider how your {family} household uses each space throughout the day.",
    discuss: [
      "Which rooms would benefit most from morning or indirect daylight?",
      "How can window size and placement balance daylight with unwanted heat and glare?",
      "Could courtyards, skylights, or internal openings improve light in deeper spaces?",
      "How can privacy and neighboring buildings be considered without unnecessarily blocking daylight?"
    ],
    tip: "Plan daylight around how each room is used, not simply the number or size of its windows.",
    planLabel: "Light & Sun"
  },
  materials: {
    id: "materials",
    number: "04",
    title: "Materials",
    cardTitle: "Materials & Protection",
    blurb: "Choose materials with comfort, durability, and maintenance in mind.",
    label: "MATERIALS & DURABILITY",
    heroTemplate: "Choose materials that suit your home's conditions in {location}.",
    whyTemplate: "Your selected climate condition, {climate}, is a useful starting point for discussing materials and building protection. Choices depend on actual site exposure, construction quality, maintenance needs, and budget. Consider how materials will perform in your {location} home while complementing your preferred {style} design.",
    discuss: [
      "Which roof and wall assemblies suit the local climate and intended level of comfort?",
      "What waterproofing and drainage details are appropriate for the plot's actual exposure?",
      "Which finishes can withstand expected weather, dust, moisture, and everyday use?",
      "How do initial costs, maintenance requirements, durability, and repair availability compare?"
    ],
    tip: "Compare materials by their full-life performance and maintenance needs, not appearance or purchase price alone.",
    planLabel: "Materials"
  },
  spatial: {
    id: "spatial",
    number: "05",
    title: "Spatial considerations",
    cardTitle: "Space & Privacy",
    blurb: "Make your available space work for your household and future needs.",
    label: "SPACE & EVERYDAY LIVING",
    heroTemplate: "Make every part of your {plot} home work harder for you.",
    whyTemplate: "Your {plot} plot and {family} household make efficient planning worth discussing. A thoughtful layout can balance circulation, privacy, storage, and usable room sizes without wasting valuable space. Consider your {outdoor} outdoor use and future plans for {future} when deciding which spaces deserve priority.",
    discuss: [
      "How can the layout balance room sizes, circulation, storage, and usable floor area?",
      "Which spaces need greater privacy or separation between shared and quiet activities?",
      "How can indoor spaces connect with outdoor areas in a way that suits your household?",
      "Could the layout adapt to changing family needs without major structural alterations?"
    ],
    tip: "Plan around daily routines and furniture placement before deciding how much space each room needs.",
    planLabel: "Spatial Considerations"
  },
  "design-direction": {
    id: "design-direction",
    number: "06",
    title: "Design direction",
    cardTitle: "Design Direction",
    blurb: "Bring your preferred style together with practical, lasting decisions.",
    label: "DESIGN & IDENTITY",
    heroTemplate: "Give your {style} home a clear and considered direction.",
    whyTemplate: "Your preference for {style} design provides a starting point for a cohesive home. Translate that preference into practical decisions about layout, materials, openings, finishes, and outdoor spaces. In {location}, choices should also respond to local conditions and the needs of your {family} household.",
    discuss: [
      "Which architectural features best express the preferred style without compromising everyday function?",
      "How can materials, colors, openings, and finishes work together consistently?",
      "How can the design balance aesthetics with daylight, privacy, ventilation, and maintenance?",
      "Which design elements deserve investment now, and where could simpler choices achieve a similar result?"
    ],
    tip: "Establish a clear design direction early so individual choices support one coherent home.",
    planLabel: "Design Direction"
  }
};
