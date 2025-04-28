import "dotenv/config";
import { Client, GatewayIntentBits, Events, Collection } from "discord.js";
import { chatCommand, chatCommandHandler } from "./commands/chat.js";
import { registerAllCommands } from "./register-all-commands.js";
import { commands } from "./commands/index.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async () => {
  console.log("Registering commands...");
  await registerAllCommands();

  console.log("Bot is ready!");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;
  if (!interaction.guild) {
    await interaction.reply({
      content: "This command can only be used in a server.",
      ephemeral: true,
    });
    return;
  }
  if (!interaction.isChatInputCommand()) return;

  const command = commands.find(
    (cmd) => cmd.command.name === interaction.commandName
  );

  if (!command) return;

  try {
    await command.handler(interaction);
  } catch (error) {
    console.error("Error executing command:", error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error("Failed to login:", error);
});
