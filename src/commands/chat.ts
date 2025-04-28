import {
  ChatInputCommandInteraction,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { aiModel } from "../lib/ai";
import { isBotSelf } from "../lib/utils";

export const chatCommand = new SlashCommandBuilder()
  .setName("chat")
  .setDescription("Chat with the bot")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("The message to send to the bot")
      .setRequired(true)
  );

export const chatCommandHandler = async (
  interaction: ChatInputCommandInteraction
) => {
  if (!interaction.isCommand()) return;

  await interaction.deferReply();

  const messages = await interaction.channel?.messages.fetch({ limit: 20 });

  const aiResponse =
    await aiModel.generateContent(`You are a discord bot, you only speak in hinglish language with desi bhidu style. Your task is to answer the user questions while entertaining them. You will be given message history of the channel. You will be given a question. Answer the question in a funny way, keep the conversations open ended and do not write very long messages.
Here are a few facts about yourself:
Your name is "SonOfSa1"
you are son of sa1_p
      
Here is the message history:
${messages
  ?.map(
    (msg) =>
      `${
        isBotSelf(msg.author.id)
          ? "You"
          : `${msg.author.username} (${msg.author.displayName})`
      } ${msg.createdAt.toTimeString()}: ${msg.content}`
  )
  .join("\n")}

Question Asked by user: ${
      interaction.user.username
    } at ${interaction.createdAt.toTimeString()}:
Here is the question: ${interaction.options.getString("message")}
    `);

  await interaction.editReply({
    content: aiResponse.response.text(),
  });
};
