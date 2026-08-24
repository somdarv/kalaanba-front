"use client";

import { createContext, useContext } from "react";

/**
 * "Am I already inside a bottom sheet?"
 *
 * `<Select>` opens its options as a `<BottomSheet>` on a phone. Some of the
 * places a `<Select>` lives are themselves bottom sheets — `/me`'s details
 * editor is one — and a sheet opening on top of a sheet is two backdrops, two
 * drag surfaces and two things listening for Escape. The inner one falls back
 * to its popover instead.
 *
 * **Context rather than a prop, deliberately.** A `nested` prop would be a
 * rule every future call site has to remember, and the failure is invisible
 * until someone opens the inner control on a phone. Nesting is a fact about
 * where a component IS, which is exactly what context is for.
 */
const InsideSheetContext = createContext(false);

export const InsideSheetProvider = InsideSheetContext.Provider;

export function useIsInsideSheet(): boolean {
  return useContext(InsideSheetContext);
}
