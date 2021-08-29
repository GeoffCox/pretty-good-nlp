import { _findRegularExpressions } from "./findRegularExpressions";
import type {
  ExampleRecognition,
} from "./types";
/**
 * @internal
 */
 export const extractVariableValues = (
    text: string,
    example: Pick<ExampleRecognition, "parts">
  ): Record<string, string[]> => {
    const variableValues: Record<string, string[]> = {};
  
    example.parts.forEach((part) => {
      if (part.variable && part.matches.length > 0) {
        const variableName = part.variable;
        part.matches.forEach((match) => {
          const value = text.substring(match.start, match.end);
          const values = variableValues[variableName];
          if (!values) {
            variableValues[variableName] = [value];
          } else {
            values.push(value);
          }
        });
      }
    });
  
    return variableValues;
  };