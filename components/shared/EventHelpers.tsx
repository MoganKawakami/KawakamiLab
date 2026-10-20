/* EventHelpers.tsx — the people who helped at a booth (event cards, PC + phone).
   Each name is a plain link to their X profile: the visible destination is the real one. */
import { Fragment } from "react";
import type { EventHelper } from "@/lib/data";

export function Helpers({ list }: { list: readonly EventHelper[] }) {
  return (
    <span className="jp">
      {list.map((h, i) => (
        <Fragment key={h.x}>
          {i > 0 && "、"}
          <a className="ev-helper" href={h.x} target="_blank" rel="noopener noreferrer">{h.name}</a> 様
        </Fragment>
      ))}
    </span>
  );
}
