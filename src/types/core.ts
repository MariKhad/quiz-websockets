import { GameStatus } from "../constants/game-constants";

export interface Player {
    name: string;
    index: string | number;
    score: number;
}

export interface Question {
    text: string;
    options: string[];       
    correctIndex: number;
    timeLimitSec: number;
}

export interface Game {
    id: string;
    code: string;
    hostId: string | number;
    questions: Question[];
    players: Player[];
    currentQuestion: number;
    status: GameStatus;
}

