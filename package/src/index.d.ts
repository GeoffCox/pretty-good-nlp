import { Intent, IntentRecognition } from "./types";
import { RecognizeOptions } from "./recognizer";

export * from "./types";
export { CharacterRange } from "./characterRange";
export { TokenRange } from "./tokenRange";
export { TokenMap } from "./tokenMap";

export function recognize(text: string,intent: Intent,options?: RecognizeOptions) :  IntentRecognition;