import { chatCommand, chatCommandHandler } from "./chat";
import { matchScoreCommand, matchScoreCommandHandler } from "./match-score";

export const commands = [
  {
    command: chatCommand,
    handler: chatCommandHandler,
  },
  {
    command: matchScoreCommand,
    handler: matchScoreCommandHandler,
  },
];
