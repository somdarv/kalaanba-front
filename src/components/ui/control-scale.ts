/**
 * The control scale — how tall a control is, in one place.
 *
 * Kalaanba is used on a phone in a stadium, one-handed, often by someone who
 * is not looking closely. DESIGN_LANGUAGE §9.2 makes that the default case:
 * "mobile = comfortable default; desktop opts into compact via
 * `@media (min-width: 1024px)`". Seven input primitives were each hardcoding
 * a flat `h-12`, so the density rule was written down but never expressed —
 * and a 48px field under a 56px CTA reads as the small half of the form.
 *
 * Mobile 56px, desktop 48px. 56 is the `lg` Button height, so a field and the
 * action beneath it are the same object on a phone; 48 is what a mouse and a
 * dense admin table want, and is still above the §9.1 44px floor.
 *
 * Rule of three (engineering-standards §3): seven call sites is not a
 * coincidence. Change the scale here, not in a component.
 */

/** Fixed-height controls — TextField, Select, DateField, PhoneInput, … */
export const controlHeight = "h-14 lg:h-12";

/** Controls that grow with their content — Combobox (chips wrap onto rows). */
export const controlMinHeight = "min-h-14 lg:min-h-12";
