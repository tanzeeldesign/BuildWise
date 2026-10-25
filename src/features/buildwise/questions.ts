import type { Question } from "./types";

export const questions: Question[] = [
  {
    key: "project",
    title: "What are you planning?",
    text: "We’ll shape your guide around this project.",
    options: [
      { value: "Build a new home", description: "Starting from scratch" },
      { value: "Renovate", description: "Improving an existing home" },
      { value: "Redesign", description: "Rethinking how spaces work" },
    ],
  },
  {
    key: "location",
    title: "Where are you building?",
    text: "Location shapes climate and design priorities.",
    options: [
      { value: "Karachi", description: "Warm, coastal climate" },
      { value: "Lahore", description: "Seasonal temperature shifts" },
      { value: "Islamabad", description: "Cool winters, warm summers" },
      { value: "Other", description: "Elsewhere in Pakistan" },
    ],
  },
  {
    key: "plot",
    title: "Tell us about your space.",
    text: "Plot size affects light, privacy, and outdoor living.",
    options: [
      { value: "Under 5 marla", description: "Compact urban plot" },
      { value: "5–10 marla", description: "Typical family home size" },
      { value: "10–20 marla", description: "Room to grow" },
      { value: "1 kanal or more", description: "Generous grounds" },
    ],
  },
  {
    key: "climate",
    title: "What climate challenges matter?",
    text: "Select every environmental priority that applies to your site.",
    multi: true,
    maxSelect: 5,
    options: [
      { value: "Intense heat", description: "Hot summers and solar gain" },
      { value: "Humidity", description: "Coastal moisture and still air" },
      { value: "Monsoon rains", description: "Heavy rain and drainage" },
      { value: "Dust & haze", description: "Air quality needs" },
      { value: "Mild seasons", description: "Comfortable year-round" },
    ],
  },
  {
    key: "family",
    title: "Who will live here?",
    text: "Household size shapes how spaces should work.",
    options: [
      { value: "1–2 people", description: "Compact household" },
      { value: "3–5 people", description: "Growing family" },
      { value: "6+ people", description: "Multi-generational home" },
    ],
  },
  {
    key: "outdoor",
    title: "How do you use outdoor space?",
    text: "Courtyards and roofs can extend living space.",
    options: [
      { value: "Every day", description: "Essential living space" },
      { value: "On weekends", description: "For gathering and rest" },
      { value: "Occasionally", description: "When the weather is right" },
    ],
  },
  {
    key: "future",
    title: "What should the future hold?",
    text: "Planning ahead makes later changes easier.",
    options: [
      { value: "A growing family", description: "Rooms that can adapt" },
      { value: "Working from home", description: "Flexible, quiet spaces" },
      { value: "Parents moving in", description: "Comfort across generations" },
      { value: "No major changes", description: "Complete as it is" },
    ],
  },
  {
    key: "style",
    title: "Your preferences",
    text: "Choose the direction closest to your taste.",
    options: [
      { value: "Modern", description: "Clean lines, open spaces" },
      { value: "Traditional", description: "Familiar forms, updated" },
      { value: "Minimal", description: "Quiet materials, essentials" },
      { value: "Cultural", description: "Local craft and character" },
    ],
  },
  {
    key: "priorities",
    title: "Your priorities",
    text: "Choose up to three priorities for your plan.",
    multi: true,
    maxSelect: 3,
    options: [
      { value: "Natural light", description: "Bright, uplifting spaces" },
      { value: "Ventilation", description: "Fresh air and cooling" },
      { value: "Energy efficiency", description: "Lower demand, smarter systems" },
      { value: "Privacy", description: "Open without feeling exposed" },
      { value: "Space", description: "Generous, clear rooms" },
      { value: "Aesthetics", description: "Carefully composed look" },
    ],
  },
];

export const TOTAL_STEPS = questions.length;
