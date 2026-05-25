"use client";

import { useMemo } from "react";
import { Select, type SelectProps } from "./select";
import { COUNTRIES, type Country } from "@/lib/countries";

/**
 * CountrySelector — preset of Select for ISO country codes.
 *
 * Each option renders the flag emoji as a leading slot and the dial
 * code as the description. Searchable by name or dial code.
 */
export type CountrySelectorProps = Omit<
  SelectProps<string>,
  "options" | "renderOption" | "searchable"
> & {
  /** Custom country list. Defaults to the bundled COUNTRIES set. */
  countries?: Country[];
};

export function CountrySelector({
  countries = COUNTRIES,
  placeholder = "Choose a country",
  ...rest
}: CountrySelectorProps) {
  const options = useMemo(
    () =>
      countries.map((country) => ({
        value: country.code,
        label: country.name,
        description: country.dialCode,
        leading: (
          <span aria-hidden className="text-lg leading-none">
            {country.flag}
          </span>
        ),
      })),
    [countries],
  );

  return (
    <Select
      {...rest}
      placeholder={placeholder}
      options={options}
      searchable
    />
  );
}
