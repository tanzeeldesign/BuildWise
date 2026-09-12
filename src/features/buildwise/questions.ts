import type { Question } from "./types";

export const questions: Question[] = [
  {
    key: "project",
    title: "What are you planning?",
    text: "We'll shape your guide around the kind of project ahead.",
    options: [
      { value: "Build a new home", description: "Starting from the ground up" },
      { value: "Renovate", description: "Improving an existing home" },
      { value: "Redesign", description: "Rethinking how spaces work together" },
    ],
  },
  {
    key: "location",
    title: "Where are you building?",
    text: "Your location helps us understand the conditions your home needs to respond to.",
    options: [
      { value: "Karachi", description: "Warm, coastal climate" },
      { value: "Lahore", description: "Seasonal temperature shifts" },
      { value: "Islamabad", description: "Cool winters, warm summers" },
      { value: "Other", description: "A city or town elsewhere in Pakistan" },
    ],
  },
  {
    key: "plot",
    title: "Tell us about your space.",
    text: "Plot size shapes how light, privacy and outdoor living can work.",
    options: [
      { value: "Under 5 marla", description: "Compact urban plot" },
      { value: "5–10 marla", description: "A common family home size" },
      { value: "10–20 marla", description: "Room to breathe and grow" },
      { value: "1 kanal or more", description: "Generous grounds and gardens" },
    ],
  },
  {
    key: "climate",
    title: "What climate challenge matters most?",
    text: "A focused environmental priority helps shape early design conversations.",
    options: [
      { value: "Intense heat", description: "Long, hot summers and solar gain" },
      { value: "Humidity", description: "Coastal moisture and still air" },
      { value: "Monsoon rains", description: "Heavy rain, drainage and damp" },
      { value: "Dust & haze", description: "Air quality and filtration needs" },
      { value: "Mild seasons", description: "Comfortable swings year-round" },
    ],
  },
  {
    key: "family",
    title: "Who will live here?",
    text: "A home works better when it responds to everyone in it.",
    options: [
      { value: "1–2 people", description: "A compact household" },
      { value: "3–5 people", description: "A growing family" },
      { value: "6+ people", description: "A multi-generational home" },
    ],
  },
  {
    key: "outdoor",
    title: "How do you use outdoor space?",
    text: "Courtyards and roof spaces can become an extension of home.",
    options: [
      { value: "Every day", description: "An essential living space" },
      { value: "On weekends", description: "A place to gather and unwind" },
      { value: "Occasionally", description: "Useful when the weather is right" },
    ],
  },
  {
    key: "future",
    title: "What should the future hold?",
    text: "Thinking ahead now can make change easier later.",
    options: [
      { value: "A growing family", description: "Rooms that can adapt" },
      { value: "Working from home", description: "Flexible, quiet spaces" },
      { value: "Parents moving in", description: "Comfort across generations" },
      { value: "No major changes", description: "A home complete as it is" },
    ],
  },
  {
    key: "style",
    title: "Your preferences",
    text: "Choose the architectural direction closest to your taste.",
    options: [
      { value: "Modern", description: "Clean lines and open spaces" },
      { value: "Traditional", description: "Familiar forms, thoughtfully updated" },
      { value: "Minimal", description: "Quiet materials and essential spaces" },
      { value: "Cultural", description: "Local craft, courtyards and character" },
    ],
  },
  {
    key: "priorities",
    title: "Your priorities, considered.",
    text: "Choose up to three areas to place at the heart of your plan.",
    multi: true,
    maxSelect: 3,
    options: [
      { value: "Natural light", description: "Bright, uplifting spaces" },
      { value: "Ventilation", description: "Fresh air and natural cooling" },
      { value: "Energy efficiency", description: "Lower demand, smarter systems" },
      { value: "Privacy", description: "Open, without feeling exposed" },
      { value: "Space", description: "Room that feels generous and clear" },
      { value: "Aesthetics", description: "A home that feels carefully composed" },
    ],
  },
];

export const TOTAL_STEPS = questions.length;
