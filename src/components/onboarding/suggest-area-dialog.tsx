"use client";

import { useState } from "react";

import { Button, Dialog, TextField, Textarea, useToast } from "@/components/ui";
import { useSuggestArea } from "@/lib/api/hooks/use-zone";

/**
 * SuggestAreaDialog — when a user can't find their locality, they propose it
 * (Zone engine §5: "the user suggests the area and admin maps it after
 * review"). Posts to the admin review queue; the user is not blocked.
 */

export type SuggestAreaDialogProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  cityHubId: string;
  hubName: string;
  /** Called after a suggestion is accepted, with the proposed name. */
  onSuggested: (name: string) => void;
};

const NAME_MIN = 2;
const NAME_MAX = 80;

export function SuggestAreaDialog({
  open,
  onOpenChange,
  cityHubId,
  hubName,
  onSuggested,
}: SuggestAreaDialogProps) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const suggest = useSuggestArea();
  const toast = useToast();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < NAME_MIN) {
      setError("Enter the name of your area.");
      return;
    }
    try {
      await suggest.mutateAsync({
        city_hub_id: cityHubId,
        proposed_name: trimmed,
        note: note.trim() || null,
      });
      toast.push({
        title: "Thanks — we'll review it",
        description: `“${trimmed}” was sent to the ${hubName} team.`,
        tone: "success",
      });
      onSuggested(trimmed);
      setName("");
      setNote("");
      onOpenChange(false);
    } catch {
      setError("Couldn't send that just now. Try again in a moment.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Suggest your area"
      description={`Tell us the locality you represent in ${hubName}. An admin maps it to a zone after a quick review.`}
      dismissible={!suggest.isPending}
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <TextField
          label="Area name"
          placeholder="e.g. Taha"
          autoComplete="off"
          enterKeyHint="done"
          maxLength={NAME_MAX}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
          error={error ?? undefined}
        />
        <Textarea
          label="Anything that helps locate it? (optional)"
          placeholder="Landmark, nearby area, etc."
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button
            type="button"
            intent="ghost"
            onClick={() => onOpenChange(false)}
            disabled={suggest.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" loading={suggest.isPending}>
            Send suggestion
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
