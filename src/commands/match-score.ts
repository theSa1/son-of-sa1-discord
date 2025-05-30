import {
  ChatInputCommandInteraction,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import fs from "fs/promises";
import type { UsefulMatchStats } from "../lib/cricket/types";

export const matchScoreCommand = new SlashCommandBuilder()
  .setName("match-score")
  .setDescription("Get the current score of the cricket match");

export const matchScoreCommandHandler = async (
  interaction: ChatInputCommandInteraction
) => {
  if (!interaction.isCommand()) return;

  if (!(await fs.exists("cricket-match-data.json"))) {
    await interaction.reply({
      content: "No match data available. Please subscribe to a match first.",
      ephemeral: true,
    });
    return;
  }

  const matchDataRaw = await fs.readFile("cricket-match-data.json", "utf-8");

  try {
    const matchData = JSON.parse(matchDataRaw) as UsefulMatchStats;

    if (!matchData) {
      await interaction.reply({
        content: "No match data available. Please subscribe to a match first.",
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(matchData.title)
      .addFields(
        {
          name: matchData.teams[0]?.name || "Team 1",
          value: `${matchData.teams[0]?.score ?? "0/0"}${
            matchData.teams[0]?.scoreInfo
              ? ` (${matchData.teams[0].scoreInfo})`
              : ""
          }`,
          inline: true,
        },
        {
          name: matchData.teams[1]?.name || "Team 2",
          value: `${matchData.teams[1]?.score ?? "0/0"}${
            matchData.teams[1]?.scoreInfo
              ? ` (${matchData.teams[1].scoreInfo})`
              : ""
          }`,
          inline: true,
        }
      )
      .setFooter({
        text: matchData.statusText || "Match Status",
      });

    await interaction.reply({
      embeds: [embed],
    });
  } catch (error) {
    console.error("Error parsing match data:", error);
    await interaction.reply({
      content: "Error retrieving match data. Please try again later.",
      ephemeral: true,
    });
    return;
  }
};
