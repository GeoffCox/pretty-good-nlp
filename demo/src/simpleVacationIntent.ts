import type { Intent } from "@geoffcox/pretty-good-nlp";

export const simpleVacationIntent: Intent = {
  name: "Add vacation",
  examples: [
    {
      canonicalForm: "I will be on vacation Monday",
      parts: [
        {
          phrases: ["I am", "I'm", "I will", "I will be", "I'll be"],
        },
        {
          phrases: [
            "on",
            "out on",
            "away on",
            "going",
            "going on",
            "starting",
            "start",
            "take",
            "taking",
          ],
        },
        {
          phrases: [
            "vacation",
            "away",
            "leave",
            "away on leave",
            "out",
            "out of office",
            "OOF",
            "OOO",
            "holiday",
            "personal day",
          ],
        },
        {
          phrases: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Mon",
            "Tue",
            "Tues",
            "Wed",
            "Thur",
            "Thurs",
            "Fri",
            "Sat",
            "Sun",
          ],
          variable: "dayOfWeek",
        },
      ],
    },
  ],
};
