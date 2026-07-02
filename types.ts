export interface Player {
  id: string;
  name: string;
  emoji: string;
  color: string;
  goals: number;
}

export interface Match {
  id: string;
  roundId: string; // "r16" | "qf" | "sf" | "f"
  player1: Player | null; // null represents empty or bye
  player2: Player | null; // null represents empty or bye
  score1: number | '';
  score2: number | '';
  winnerId: string | null;
  isBye: boolean;
  matchIndex: number; // Index in that round
  scorers: { playerId: string; count: number }[];
}

export interface Round {
  id: string;
  name: string;
  matches: Match[];
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  players: Player[];
  rounds: Round[];
  championId: string | null;
  isCompleted: boolean;
}

export interface PastChampion {
  id: string;
  tournamentName: string;
  championName: string;
  championEmoji: string;
  championColor: string;
  runnerUpName: string;
  date: string;
  playerCount: number;
}
