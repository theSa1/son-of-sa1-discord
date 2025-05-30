import "dotenv/config";
import { Client, GatewayIntentBits, Events, Collection } from "discord.js";
import { chatCommand, chatCommandHandler } from "./commands/chat.js";
import { registerAllCommands } from "./register-all-commands.js";
import { commands } from "./commands/index.js";
import { subscribe } from "./lib/cricket/subscribe.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const matchMaster = [
  {
    from: "2025-05-30T09:46:08.049Z",
    to: "2025-05-30T19:30:00.000Z",
    seriesId: "1449924",
    matchId: "1473509",
  },
  // {
  //   from: "2025-05-30T09:46:08.049Z",
  //   to: "2025-05-30T19:30:00.000Z",
  //   seriesId: "1486324",
  //   matchId: "1486333",
  // },
  {
    from: "2025-06-01T11:30:00.000Z",
    to: "2025-06-01T19:30:00.000Z",
    seriesId: "1449924",
    matchId: "",
  },
  {
    from: "2025-06-03T11:30:00.000Z",
    to: "2025-06-03T19:30:00.000Z",
    seriesId: "1449924",
    matchId: "",
  },
];

client.once(Events.ClientReady, async () => {
  console.log("Registering commands...");
  await registerAllCommands();

  console.log("Bot is ready!");

  // subscribe("1486333", "1486324", Date.now() + 1000 * 60 * 60 * 24 * 7, client);
  for (const match of matchMaster) {
    // check if match is passed
    const now = new Date();
    const fromDate = new Date(match.from);
    const toDate = new Date(match.to);
    // if to date is before now, skip
    if (toDate < now) {
      console.log(`Skipping match ${match.matchId} as it has already passed.`);
      continue;
    }

    // if the from is passed, subscribe to the match
    if (fromDate < now) {
      console.log(
        `Subscribing to match ${match.matchId} as it has already started.`
      );
      await subscribe(match.matchId, match.seriesId, toDate.getTime(), client);
    } else {
      const delay = fromDate.getTime() - now.getTime();
      setTimeout(() => {
        console.log(
          `Subscribing to match ${match.matchId} as it has started now.`
        );
        subscribe(match.matchId, match.seriesId, toDate.getTime(), client);
      }, delay);
    }
  }
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
