import type { PersonalInfo } from "~contents/types/pii";

export const buildReplacements = (fields: PersonalInfo[]): Record<string, string> =>
  fields.reduce(
    (map, { key, value }) => {
      if (key && value) {
        map[key] = value;
      }
      return map;
    },
    {} as Record<string, string>
  );
