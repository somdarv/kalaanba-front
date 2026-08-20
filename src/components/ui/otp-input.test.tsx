import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import { OtpInput } from "./otp-input";

/**
 * The behaviour under test is the one that actually happens on a phone: the
 * code is not typed, it is tapped off the keyboard suggestion the moment the
 * SMS lands. That arrives as a single `change` carrying every digit, so these
 * cover the spread, not just the focus walk.
 */

function boxes(): HTMLInputElement[] {
  return screen.getAllByRole("textbox") as HTMLInputElement[];
}

/** Controlled harness — the component never owns its value. */
function Harness({
  onValue,
  initial = "",
}: {
  onValue?: (next: string) => void;
  initial?: string;
}) {
  const [value, setValue] = useState(initial);
  return (
    <OtpInput
      value={value}
      onChange={(next) => {
        setValue(next);
        onValue?.(next);
      }}
      aria-label="One-time code"
    />
  );
}

describe("<OtpInput> — one-tap fill", () => {
  it("spreads a whole code delivered into the first box", () => {
    const onValue = vi.fn();
    render(<Harness onValue={onValue} />);

    fireEvent.change(boxes()[0]!, { target: { value: "123456" } });

    expect(onValue).toHaveBeenCalledWith("123456");
    expect(boxes().map((b) => b.value)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
    ]);
  });

  it("restarts at box 0 when a whole code lands in a later box", () => {
    // The keyboard fills whichever box has focus. A six-digit code dropped
    // into box 4 must not keep two digits and drop four.
    const onValue = vi.fn();
    render(<Harness onValue={onValue} />);

    fireEvent.change(boxes()[3]!, { target: { value: "987654" } });

    expect(onValue).toHaveBeenCalledWith("987654");
  });

  it("does not cap the fill at one character", () => {
    // `maxLength={1}` is enforced against autofill too, which is what made
    // one-tap fill silently drop five digits.
    render(<Harness />);
    expect(boxes()[0]!.maxLength).toBe(6);
  });

  it("offers the SMS suggestion on every box, not only the first", () => {
    render(<Harness />);
    for (const box of boxes()) {
      expect(box).toHaveAttribute("autocomplete", "one-time-code");
    }
  });

  it("spreads a partial fill from the box that received it", () => {
    const onValue = vi.fn();
    render(<Harness onValue={onValue} />);

    fireEvent.change(boxes()[2]!, { target: { value: "789" } });

    expect(onValue).toHaveBeenCalledWith("  789");
  });

  it("fills from a paste without going through maxLength", () => {
    const onValue = vi.fn();
    render(<Harness onValue={onValue} />);

    fireEvent.paste(boxes()[0]!, {
      clipboardData: { getData: () => " 246 813 " },
    });

    expect(onValue).toHaveBeenCalledWith("246813");
  });

  it("ignores characters the pattern rejects", () => {
    const onValue = vi.fn();
    render(<Harness onValue={onValue} />);

    fireEvent.change(boxes()[0]!, { target: { value: "1a2b3c" } });

    expect(onValue).toHaveBeenCalledWith("123");
  });
});

describe("<OtpInput> — typing", () => {
  it("takes one character per box and advances", () => {
    const onValue = vi.fn();
    render(<Harness onValue={onValue} />);

    fireEvent.change(boxes()[0]!, { target: { value: "7" } });

    expect(onValue).toHaveBeenCalledWith("7");
    expect(boxes()[1]!).toHaveFocus();
  });

  it("replaces rather than spreads when typing over an existing digit", () => {
    // The browser reports old + new when the caret sits after the digit.
    // Two characters is a replacement, not a code arriving.
    const onValue = vi.fn();
    render(<Harness onValue={onValue} initial="4" />);

    fireEvent.change(boxes()[0]!, { target: { value: "49" } });

    expect(onValue).toHaveBeenCalledWith("9");
  });

  it("walks back on backspace from an empty box", () => {
    const onValue = vi.fn();
    render(<Harness onValue={onValue} initial="12" />);

    fireEvent.keyDown(boxes()[2]!, { key: "Backspace" });

    expect(onValue).toHaveBeenCalledWith("1");
    expect(boxes()[1]!).toHaveFocus();
  });
});
