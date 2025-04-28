import { chatCommand, chatCommandHandler } from "./chat";

export const commands = [
  {
    command: chatCommand,
    handler: chatCommandHandler,
  },
];
