/**
 * Countries — minimal ISO-3166 dataset for the CountrySelector primitive.
 *
 * Order: Ghana first (Kalaanba is grassroots-Ghana), then ECOWAS, then
 * the rest sorted by name. Flags use country-code emoji which render
 * correctly on iOS/Android and most desktop platforms.
 *
 * If a property changes, update [docs/glossary.md] entry for "country"
 * and bump consumers.
 */
export type Country = {
  /** ISO 3166-1 alpha-2 code. Internal key (snake/upper invariant). */
  code: string;
  name: string;
  /** International dial code with leading +. */
  dialCode: string;
  /** Country flag emoji. */
  flag: string;
};

export const COUNTRIES: Country[] = [
  { code: "GH", name: "Ghana", dialCode: "+233", flag: "🇬🇭" },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
  { code: "CI", name: "Côte d'Ivoire", dialCode: "+225", flag: "🇨🇮" },
  { code: "SN", name: "Senegal", dialCode: "+221", flag: "🇸🇳" },
  { code: "BF", name: "Burkina Faso", dialCode: "+226", flag: "🇧🇫" },
  { code: "ML", name: "Mali", dialCode: "+223", flag: "🇲🇱" },
  { code: "TG", name: "Togo", dialCode: "+228", flag: "🇹🇬" },
  { code: "BJ", name: "Benin", dialCode: "+229", flag: "🇧🇯" },
  { code: "LR", name: "Liberia", dialCode: "+231", flag: "🇱🇷" },
  { code: "SL", name: "Sierra Leone", dialCode: "+232", flag: "🇸🇱" },
  { code: "GN", name: "Guinea", dialCode: "+224", flag: "🇬🇳" },
  { code: "GM", name: "Gambia", dialCode: "+220", flag: "🇬🇲" },
  { code: "GW", name: "Guinea-Bissau", dialCode: "+245", flag: "🇬🇼" },
  { code: "CV", name: "Cabo Verde", dialCode: "+238", flag: "🇨🇻" },
  { code: "NE", name: "Niger", dialCode: "+227", flag: "🇳🇪" },
  // Wider Africa
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪" },
  { code: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬" },
  { code: "MA", name: "Morocco", dialCode: "+212", flag: "🇲🇦" },
  { code: "TN", name: "Tunisia", dialCode: "+216", flag: "🇹🇳" },
  { code: "DZ", name: "Algeria", dialCode: "+213", flag: "🇩🇿" },
  { code: "ET", name: "Ethiopia", dialCode: "+251", flag: "🇪🇹" },
  { code: "RW", name: "Rwanda", dialCode: "+250", flag: "🇷🇼" },
  { code: "UG", name: "Uganda", dialCode: "+256", flag: "🇺🇬" },
  { code: "TZ", name: "Tanzania", dialCode: "+255", flag: "🇹🇿" },
  { code: "CM", name: "Cameroon", dialCode: "+237", flag: "🇨🇲" },
  // Diaspora targets
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪" },
  { code: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { code: "QA", name: "Qatar", dialCode: "+974", flag: "🇶🇦" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
];

export function findCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
