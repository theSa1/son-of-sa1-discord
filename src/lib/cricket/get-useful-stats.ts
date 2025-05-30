import type {
  MatchDetailsType,
  ScoreCardType,
  UsefulMatchStats,
} from "./types";

export const getUsefulStats = (
  match: MatchDetailsType
): UsefulMatchStats | null => {
  return {
    title:
      match.teams.map((team) => team.team.abbreviation).join(" vs ") ||
      "Match Details",
    teams: match.teams.map((team) => ({
      name: team.team.abbreviation,
      score: team.score,
      scoreInfo: team.scoreInfo,
    })),
    statusText:
      match.statusText ===
      "Match starts in {{MATCH_START_HOURS}} {{MATCH_START_MINS}}"
        ? "Match yet to begin"
        : match.statusText,
  };
};
