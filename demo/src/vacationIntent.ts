import type { Intent } from "@geoffcox/pretty-good-nlp";

export const vacationShared = {
  iWillPhrases: ["I am", "I'm", "I will", "I will be", "I'll be"],
  vacationActionPhrases: [
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
  vacationPhrases: [
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
  daysOfTheWeek: [
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
  negativePhrases: [
    "won't",
    "can't",
    "will not",
    "can not",
    "cannot",
    "cancel",
    "cancelling",
    "cancelled",
    "remove",
    "minus",
    "without",
  ],
  dateFormat: ["\\d{1,2}\\/\\d{1,2}(\\/(\\d{4}|\\d{2}))?"],
};

export const vacationIntent: Intent = {
  name: "Add vacation",
  examples: [
    {
      name: "Add vacation <dayOfWeek | date>",
      parts: [
        {
          phrases: ["add", "set", "plus"],
          weight: 20,
        },
        {
          phrases: ["$ref=vacationPhrases"],
        },
        {
          phrases: ["$ref=daysOfTheWeek"],
          regularExpressions: ["$ref=dateFormat"],
          variable: "dayOrDate",
          weight: 20,
        },
      ],
      neverParts: [
        {
          phrases: ["$ref=negativePhrases"],
        },
      ],
    },
    {
      name: "I will be on vacation <dayOfWeek>",
      parts: [
        {
          phrases: ["$ref=iWillPhrases"],
        },
        {
          phrases: ["$ref=vacationActionPhrases"],
        },
        {
          phrases: ["$ref=vacationPhrases"],
          weight: 4,
        },
        {
          phrases: ["$ref=daysOfTheWeek"],
          variable: "day",
          weight: 4,
        },
      ],
      neverParts: [
        {
          phrases: ["$ref=negativePhrases"],
        },
      ],
    },
    {
      name: "I will be on vacation <date> through <date>",
      parts: [
        {
          phrases: ["$ref=iWillPhrases"],
        },
        {
          phrases: ["$ref=vacationActionPhrases"],
        },
        {
          phrases: ["$ref=vacationPhrases"],
          weight: 5,
        },
        {
          regularExpressions: ["$ref=dateFormat"],
          variable: "startDate",
          weight: 5,
        },
        {
          phrases: ["through", "to", "until", " - "],
          weight: 0,
        },
        {
          regularExpressions: ["$ref=dateFormat"],
          variable: "endDate",
          weight: 100,
        },
      ],
      neverParts: [
        {
          phrases: ["$ref=negativePhrases"],
        },
      ],
    },
    {
      name:
        "I will be on vacation this <dayOfWeek> through next <dayOfWeek>",
      parts: [
        {
          phrases: ["$ref=iWillPhrases"],
        },
        {
          phrases: ["$ref=vacationActionPhrases"],
        },
        {
          phrases: ["$ref=vacationPhrases"],
          weight: 7,
        },
        {
          phrases: ["this", "next"],
          weight: 0,
          variable: "relativeStart",
        },
        {
          phrases: ["$ref=daysOfTheWeek"],
          variable: "startDay",
          weight: 7,
        },
        {
          phrases: ["through", "to", "until", "up to", " - "],
        },
        {
          phrases: ["this", "next"],
          weight: 0,
          variable: "relativeEnd",
        },
        {
          phrases: ["$ref=daysOfTheWeek"],
          variable: "endDay",
          weight: 7,
        },
      ],
      neverParts: [
        {
          phrases: ["$ref=negativePhrases"],
        },
      ],
    },
  ],
};
