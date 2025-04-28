import { REST, Routes } from "discord.js";
import { commands } from "./commands";

export const registerAllCommands = async () => {
  const commandsData = commands.map((command) => command.command.toJSON());

  const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

  try {
    console.log("Started refreshing application (/) commands.");

    for (const guildId of process.env.DISCORD_GUILD_IDS!.split(",")) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.DISCORD_APP_ID!, guildId),
        {
          body: commandsData,
        }
      );
    }

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};
