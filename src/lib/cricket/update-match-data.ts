import { ActivityType, type Client } from "discord.js";
import type { UsefulMatchStats } from "./types";
import fs from "fs/promises";

export const updateMatchData = async (
  usefulStats: UsefulMatchStats | null,
  client: Client
) => {
  if (!usefulStats) {
    return;
  }

  client.user?.setPresence({
    activities: [
      {
        name: usefulStats.title,
        type: ActivityType.Watching,
        state: `${usefulStats.statusText}`,
      },
    ],
    status: "online",
  });

  await fs
    .writeFile("cricket-match-data.json", JSON.stringify(usefulStats, null, 2))
    .catch((err) => {
      console.error("Error writing match data to file:", err);
    });
};
