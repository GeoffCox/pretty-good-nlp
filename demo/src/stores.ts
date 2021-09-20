import { derived, writable } from "svelte/store";
import { coffeeIntent } from "./intents/coffeeIntent";
import { vacationIntent, vacationShared } from "./intents/vacationIntent";
import {playgroundIntent, playgroundShared} from "./intents/playgroundIntent";
import type { DemoDocument } from "./types";

export const initialDemoDocuments = [
  {
    name: "Coffee Order",
    intents: [coffeeIntent],
  },
  {
    name: "Vacation",
    intents: [vacationIntent],
    shared: vacationShared,
  },
  {
    name: "Playground",
    intents: [playgroundIntent],
    shared: playgroundShared,
  },
];

export const demoDocuments = writable<DemoDocument[]>(initialDemoDocuments.slice());

export const demoDocumentIndex = writable<number>(0);

export const demoDocument = derived(
  [demoDocuments, demoDocumentIndex],
  ([$demoDocuments, $demoDocumentIndex]) => {
    return $demoDocuments[$demoDocumentIndex];
  }
);
