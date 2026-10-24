import { z } from "zod";
import {
  branchSchema,
  userSchema,
  demoDataSchema,
  DomainError,
  type DemoData,
  type DemoUser,
  type SettingsCommand,
} from "./model";
import { assertAdmin, mutate } from "./orders";
export const settingsFormSchema = z.object({
  shopName: z
    .string()
    .trim()
    .min(1, "Enter a demonstration shop name.")
    .max(60),
  receiptNote: z.string().max(200),
  branches: z.array(branchSchema).length(2),
  users: z
    .array(userSchema.pick({ id: true, name: true, active: true }))
    .length(3),
});
export function applySettings(
  data: DemoData,
  user: DemoUser,
  c: SettingsCommand,
  now: string,
): DemoData {
  if (c.type === "preferences") {
    const values = demoDataSchema.shape.preferences.parse(c.values);
    return mutate(
      data,
      user,
      c.requestId,
      "Browser preferences updated",
      "Table density and reduced motion for this local demo browser",
      now,
      (draft) => {
        draft.preferences = values;
      },
    );
  }
  assertAdmin(user);
  const values = settingsFormSchema.parse(c.values);
  if (
    new Set(values.branches.map((b) => b.id)).size !== 2 ||
    new Set(values.users.map((u) => u.id)).size !== 3 ||
    !data.users.every((u) => values.users.some((v) => v.id === u.id))
  )
    throw new DomainError(
      "validation",
      "Keep the two existing branches and three demo account references. Adding production identities requires backend integration.",
    );
  if (!values.users.find((u) => u.id === user.id)?.active)
    throw new DomainError(
      "validation",
      "Keep the current Administrator demo account active to preserve access.",
    );
  return mutate(
    data,
    user,
    c.requestId,
    "Demonstration configuration updated",
    "Shop label, branch labels and fixed-role demo account settings",
    now,
    (draft) => {
      draft.settings.shopName = values.shopName;
      draft.settings.receiptNote = values.receiptNote;
      draft.branches = values.branches;
      draft.users = draft.users.map((u) => ({
        ...u,
        ...values.users.find((v) => v.id === u.id)!,
      }));
    },
  );
}
