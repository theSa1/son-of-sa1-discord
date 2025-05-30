import { getHmac } from "./get-hmac";
import type { MatchDetailsType, ScoreCardType } from "./types";

export const getCurrentScoreboard = async (
  matchId: string,
  seriesId: string
) => {
  const path = `/v1/pages/match/scorecard?lang=en&seriesId=${seriesId}&matchId=${matchId}`;

  const res = await fetch(`https://hs-consumer-api.espncricinfo.com${path}`, {
    headers: {
      "x-hsci-auth-token": getHmac(path),
    },
  });

  return res.json() as Promise<{
    content: ScoreCardType;
    match: MatchDetailsType;
  }>;
};
