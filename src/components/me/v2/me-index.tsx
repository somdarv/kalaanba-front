"use client";

import { Button, Divider } from "@/components/ui";
import type { CurrentUser } from "@/lib/api/auth";
import { labelFor, type MyPlayer, type PlayerMeta } from "@/lib/api/player";

import { ClubRows, FREE_AGENT_KEY } from "./club-rows";
import { IndexGroup } from "./index-group";
import { AccountRows, ComingRows, DetailRows } from "./index-rows";
import { PlayingControl } from "./playing-control";
import { RecordFeature } from "./record-feature";
import { WorkspacePane } from "./workspace-pane";

/**
 * The middle pane: everything about you, as one source list.
 *
 * Six groups in one panel rather than six cards in a column. A card per block
 * gives every section the same weight and six competing borders; a source list
 * gives the pane one border and lets the group labels do the separating, which
 * is what makes the featured tile at the top read as featured.
 *
 * **Order is by what a player came for.** The record first because it is the
 * thing that changes, availability second because it is the thing they can
 * change, then the club, the details, the account, and last the honest list of
 * what is not built.
 *
 * Every group below the first is either a read of backend truth or a link to a
 * screen that exists. Nothing here computes football (Constitution Law 3) and
 * every display string comes from `meta` (Law 4).
 */

export type MeIndexProps = {
  user: CurrentUser;
  player: MyPlayer | null;
  meta: PlayerMeta;
  onEdit: () => void;
  className?: string;
};

export function MeIndex({
  user,
  player,
  meta,
  onEdit,
  className,
}: MeIndexProps) {
  return (
    <WorkspacePane
      label="Your record"
      className={className}
      contentClassName="gap-3"
    >
      {player ? (
        <>
          <IndexGroup id="me-record" title="Card level">
            <RecordFeature confidence={player.confidence} meta={meta} />
          </IndexGroup>
          <Divider />

          <IndexGroup id="me-playing" title="When you play">
            <PlayingControl player={player} meta={meta} />
          </IndexGroup>
          <Divider />

          <IndexGroup
            id="me-club"
            title="Your club"
            note={
              player.market_status !== FREE_AGENT_KEY ? (
                <span className="text-fg-subtle text-xs">
                  {labelFor(meta.market_statuses, player.market_status)}
                </span>
              ) : null
            }
          >
            <ClubRows player={player} />
          </IndexGroup>
          <Divider />

          <IndexGroup
            id="me-details"
            title="Your details"
            note={
              <Button intent="ghost" size="sm" onClick={onEdit}>
                Edit
              </Button>
            }
          >
            <DetailRows player={player} meta={meta} />
          </IndexGroup>
          <Divider />
        </>
      ) : null}

      <IndexGroup id="me-account" title="Your account">
        <AccountRows user={user} />
      </IndexGroup>
      <Divider />

      <IndexGroup
        id="me-coming"
        title="Coming"
        note={<span className="text-fg-subtle text-xs">Not built yet</span>}
      >
        <ComingRows />
      </IndexGroup>
    </WorkspacePane>
  );
}
