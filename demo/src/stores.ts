import { writable } from "svelte/store";
import { coffeeIntent } from "./intents/coffeeIntent";
import { vacationIntent, vacationShared } from "./intents/vacationIntent";
import type { IntentsDocument } from "./types";

export const intentsDocuments = writable<IntentsDocument[]>([
    {
        name: "Coffee Order",
        intents: [coffeeIntent]
    },
    {
        name: "Vacation",
        intents: [vacationIntent],
        shared: vacationShared
    }
]);
