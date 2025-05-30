export type UsefulMatchStats = {
  title: string;
  teams: {
    name: string;
    score: string | null;
    scoreInfo: string | null;
  }[];
  currentOver?: {
    balls: string[];
  };
  statusText?: string;
};

export type ScoreCardType = {
  innings: {
    inningNumber: number;
    overs: number;
    runs: number;
    wickets: number;
    isCurrent: boolean;
    isBatted: boolean;
    target?: number;
    team: {
      abbreviation: string;
      longName: string;
    };
  }[];
};

export type MatchDetailsType = {
  statusText: string;
  teams: {
    score: string;
    scoreInfo: string | null;
    team: {
      abbreviation: string;
      longName: string;
    };
  }[];
};
