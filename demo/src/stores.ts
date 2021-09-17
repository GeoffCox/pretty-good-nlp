import { derived, writable } from "svelte/store";
import { coffeeIntent } from "./intents/coffeeIntent";
import { vacationIntent, vacationShared } from "./intents/vacationIntent";
import type { DemoDocument } from "./types";

export const demoDocuments = writable<DemoDocument[]>([
  {
    name: "Coffee Order",
    intents: [coffeeIntent],
  },
  {
    name: "Vacation",
    intents: [vacationIntent],
    shared: vacationShared,
  },
]);

export const demoDocumentIndex = writable<number>(0);

export const demoDocument = derived(
  [demoDocuments, demoDocumentIndex],
  ([$demoDocuments, $demoDocumentIndex]) => {
    return $demoDocuments[$demoDocumentIndex];
  }
);
