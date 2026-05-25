import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
type Align = "start" | "center" | "end" | "stretch" | "baseline";
type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";

const GAP: Record<Space, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
};

const ALIGN: Record<Align, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const JUSTIFY: Record<Justify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  direction?: "row" | "column";
  gap?: Space;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
};

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  {
    direction = "column",
    gap = 4,
    align,
    justify,
    wrap,
    className,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        direction === "row" ? "flex-row" : "flex-col",
        GAP[gap],
        align && ALIGN[align],
        justify && JUSTIFY[justify],
        wrap && "flex-wrap",
        className,
      )}
      {...rest}
    />
  );
});

export const HStack = forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  function HStack(props, ref) {
    return <Stack ref={ref} direction="row" {...props} />;
  },
);

export const VStack = forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  function VStack(props, ref) {
    return <Stack ref={ref} direction="column" {...props} />;
  },
);
