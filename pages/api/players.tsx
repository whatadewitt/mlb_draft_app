import readline from "readline";
import fs from "fs";
import { Player } from "../../utils/types";
import { initialPlayerData, playerLimits } from "../../utils/constants";
import { getPlayerNotes, sortByPrice } from "../../utils/shared";

const getCustomPlayers = async (filename: string) => {
  const players: Player[] = [];
  const playerData = readline.createInterface({
    input: fs.createReadStream(`data/${filename}.csv`),
    output: process.stdout,
    terminal: false,
  });

  let idx = 0;
  for await (const line of playerData) {
    if (idx > 0) {
      const [name, team, position, price, iPrice] = line
        .replace(/"/g, "")
        .split(",");

      let player = {
        id: `custom-${idx}`,
        price: parseFloat(price),
        iPrice: parseFloat(iPrice),
        adp: -1,
        cost: 0,
        drafted: false,
        name,
        position,
        notes: "",
        target: false,
      } as Player;

      player = getPlayerNotes(player);

      players.push(player);
    }

    idx++;
  }

  return players;
};

const getPlayers = async (filename: string) => {
  const players: Player[] = [];
  const playerData = readline.createInterface({
    input: fs.createReadStream(`data/${filename}.csv`),
    output: process.stdout,
    terminal: false,
  });

  for await (const line of playerData) {
    const [
      name,
      team,
      position,
      adp,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      price,
      iPrice,
      cost,
      playerId,
    ] = line.replace(/"/g, "").split(",");

    let player = {
      id: playerId,
      price: parseFloat(price),
      iPrice: cost ? cost : parseFloat(iPrice),
      cost: cost ? parseFloat(cost) : 0,
      drafted: cost ? true : false,
      name,
      adp: parseFloat(adp),
      position,
      notes: "",
      target: false,
    } as Player;

    player = getPlayerNotes(player);

    players.push(player);
  }

  return players;
};

export async function importPlayerData(): Promise<any> {
  const hitters = await getPlayers("hitters");
  const pitchers = await getPlayers("pitchers");

  const players = hitters.concat(pitchers);
  const playerData = initialPlayerData;

  Object.entries(playerLimits).forEach(([key, val]) => {
    playerData[key] = players
      .filter(({ position }) => {
        if ("DH" === key) {
          return position === "DH" || position === "P/DH";
        } else {
          return position.indexOf(key) > -1;
        }
      })
      .slice(0, val);
  });

  const custom = await getCustomPlayers("custom");

  if (custom.length) {
    for (const p of custom) {
      p.position.split("/").forEach((pos) => {
        playerData[pos].push(p);
      });
    }

    Object.keys(playerLimits).forEach((key) => {
      playerData[key] = playerData[key].sort(sortByPrice);
    });
  }

  return playerData;
}

export default function handler(req, res) {
  res.status(200).json({ name: "John Doe" });
}
