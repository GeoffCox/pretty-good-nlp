import { writable } from "svelte/store";
import { coffeeIntent } from "./intents/coffeeIntent";
import { vacationIntent, vacationShared } from "./intents/vacationIntent";
import type { DemoExample } from "./types";

export const intentsDocuments = writable<DemoExample[]>([
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
