import fs from "fs";
import { Player } from "./types";

export function isPlain(player: Player) {
  return (
    !player.drafted &&
    !player.notes &&
    !player.target &&
    !player.avoid &&
    !player.injured
  );
}

export function sortByPrice(a, b) {
  const aPrice = a.customPrice || a.price;
  const bPrice = b.customPrice || b.price;

  return bPrice - aPrice;
}

export function getPlayerNotes(player) {
  try {
    const filename = `players/${player.id}.json`;
    if (fs.existsSync(filename)) {
      //file exists
      let customData = JSON.parse(fs.readFileSync(filename).toString());
      return { ...player, ...customData };
    }
  } catch (err) {
    // console.error(err);
    // silent fail
  }

  return player;
}
