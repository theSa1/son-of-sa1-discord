export const isBotSelf = (userId: string) => {
  return userId === process.env.DISCORD_APP_ID;
};
