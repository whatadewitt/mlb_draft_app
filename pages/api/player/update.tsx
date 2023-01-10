import fs from "fs";
import { isPlain } from "../../../utils/shared";
import { Player } from "../../../utils/types";

export default function handler(req, res) {
  const player = req.body as Player;

  if (isPlain(player)) {
    // if plain, delete the file
    try {
      fs.unlinkSync(`players/${player.id}.json`);
    } catch (e) {
      console.error("error deleting file");
    }
  } else {
    // if not... write the file
    fs.writeFileSync(
      `players/${player.id}.json`,
      JSON.stringify({
        drafted: player.drafted,
        notes: player.notes,
        avoid: player.avoid,
        target: player.target,
        injured: player.injured,
      })
    );
  }

  res.json({ success: "ok" });
}
