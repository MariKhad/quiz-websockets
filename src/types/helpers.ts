import WebSocket from 'ws';
import { Player } from './core';

export interface PlayerResult {
    name: string;
    answered: boolean;
    correct: boolean;
    pointsEarned: number;
    totalScore: number;
}

export interface ScoreboardEntry {
    name: string;
    score: number;
    rank: number;
}

export interface PlayerAnswer {
    playerIndex: string | number;
    answerIndex: number;
    timestamp: number;
}

export interface TimerData {
    gameId: string;
    questionIndex: number;
    timeout: NodeJS.Timeout;
    startTime: number;
    remainingTimeMs?: number;
}

export interface PlayerConnection {
    ws: WebSocket;
    player: Player;
}

export interface ErrorResponse {
    type: string;
    data: {
        error: true;
        errorText: string;
    };
    id: 0;
}