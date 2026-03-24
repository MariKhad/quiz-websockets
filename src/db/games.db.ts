import { PlayerAnswer } from '../types/helpers';
import { Game, Player, Question } from '../types/core';
import { players } from './players.db';


export const games = new Map<string, Game>();

export const gameAnswers = new Map<string, Map<string, PlayerAnswer>>();

export const activeTimers = new Map<string, NodeJS.Timeout>();

export const questionStartTimes = new Map<string, number>();

export const pausedRemainingTime = new Map<string, number>();


export function getGame(gameId: string): Game | undefined {
    return games.get(gameId);
}

export function findGameByCode(code: string): Game | undefined {
    for (const game of games.values()) {
        if (game.code === code) {
            return game;
        }
    }
    return undefined;
}

export function saveGame(game: Game): void {
    games.set(game.id, game);
}

export function deleteGame(gameId: string): boolean {
    clearGameAnswers(gameId);
    clearActiveTimer(gameId);
    clearQuestionStartTime(gameId);
    clearPausedRemainingTime(gameId);
    
    return games.delete(gameId);
}

export function updateGameStatus(gameId: string, status: Game['status']): boolean {
    const game = games.get(gameId);
    if (!game) return false;
    
    game.status = status;
    games.set(gameId, game);
    return true;
}

export function nextQuestion(gameId: string): boolean {
    const game = games.get(gameId);
    if (!game) return false;
    
    game.currentQuestion++;
    games.set(gameId, game);
    return true;
}

export function getCurrentQuestion(gameId: string): Question | undefined {
    const game = games.get(gameId);
    if (!game) return undefined;
    if (game.currentQuestion < 0 || game.currentQuestion >= game.questions.length) {
        return undefined;
    }
    return game.questions[game.currentQuestion];
}

export function getTotalQuestions(gameId: string): number {
    const game = games.get(gameId);
    return game ? game.questions.length : 0;
}


export function isHost(gameId: string, playerIndex: string): boolean {
    const game = games.get(gameId);
    return game ? String(game.hostId) === playerIndex : false;
}

export function addPlayerToGame(gameId: string, playerIndex: string): boolean {
    const game = games.get(gameId);
    if (!game) return false;
    
    const player = players.get(playerIndex);
    if (!player) return false;

    if (game.players.some(p => String(p.index) === playerIndex)) {
        return false;
    }
    
    game.players.push(player);
    games.set(gameId, game);
    return true;
}

export function removePlayerFromGame(gameId: string, playerIndex: string): boolean {
    const game = games.get(gameId);
    if (!game) return false;
    
    const initialLength = game.players.length;
    game.players = game.players.filter(p => String(p.index) !== playerIndex);
    
    if (initialLength !== game.players.length) {
        games.set(gameId, game);
        return true;
    }
    
    return false;
}


export function getPlayersInGame(gameId: string): Player[] {
    const game = games.get(gameId);
    return game ? [...game.players] : [];
}

export function getPlayerCount(gameId: string): number {
    const game = games.get(gameId);
    return game ? game.players.length : 0;
}

export function getGamesByPlayer(playerIndex: string): Game[] {
    const result: Game[] = [];
    for (const game of games.values()) {
        if (game.players.some(p => String(p.index) === playerIndex)) {
            result.push(game);
        }
    }
    return result;
}

export function removePlayerFromAllGames(playerIndex: string): string[] {
    const affectedGames: string[] = [];
    
    for (const [gameId, game] of games.entries()) {
        const hadPlayer = game.players.some(p => String(p.index) === playerIndex);
        
        if (hadPlayer) {
            game.players = game.players.filter(p => String(p.index) !== playerIndex);
            games.set(gameId, game);
            affectedGames.push(gameId);
            
            if (game.status === 'in_progress' && game.players.length === 0) {
                game.status = 'finished';
                games.set(gameId, game);
            }
        }
    }
    
    return affectedGames;
}
export function getAllGames(): Game[] {
    return Array.from(games.values());
}

export function clearAllGames(): void {
    games.clear();
    gameAnswers.clear();
    activeTimers.clear();
    questionStartTimes.clear();
    pausedRemainingTime.clear();
}

export function initGameAnswers(gameId: string): void {
    if (!gameAnswers.has(gameId)) {
        gameAnswers.set(gameId, new Map<string, PlayerAnswer>());
    }
}


export function addPlayerAnswer(
    gameId: string, 
    playerIndex: string, 
    answerIndex: number, 
    timestamp: number
): void {
    initGameAnswers(gameId);
    const answers = gameAnswers.get(gameId)!;
    answers.set(playerIndex, { playerIndex, answerIndex, timestamp });
}


export function getPlayerAnswer(gameId: string, playerIndex: string): PlayerAnswer | undefined {
    const answers = gameAnswers.get(gameId);
    return answers?.get(playerIndex);
}

export function hasPlayerAnswered(gameId: string, playerIndex: string): boolean {
    const answers = gameAnswers.get(gameId);
    return answers?.has(playerIndex) ?? false;
}

export function getAnsweredCount(gameId: string): number {
    const answers = gameAnswers.get(gameId);
    return answers ? answers.size : 0;
}

export function getAnsweredPlayers(gameId: string): PlayerAnswer[] {
    const answers = gameAnswers.get(gameId);
    return answers ? Array.from(answers.values()) : [];
}

export function hasAllPlayersAnswered(gameId: string): boolean {
    const game = games.get(gameId);
    if (!game) return false;
    
    const answers = gameAnswers.get(gameId);
    if (!answers) return false;
    
    if (game.players.length === 0) return true;
    
    for (const player of game.players) {
        if (!answers.has(String(player.index))) {
            return false;
        }
    }
    
    return true;
}

export function clearGameAnswers(gameId: string): void {
    gameAnswers.delete(gameId);
}

export function setActiveTimer(gameId: string, timeout: NodeJS.Timeout): void {
    clearActiveTimer(gameId);
    activeTimers.set(gameId, timeout);
}


export function getActiveTimer(gameId: string): NodeJS.Timeout | undefined {
    return activeTimers.get(gameId);
}

export function clearActiveTimer(gameId: string): void {
    const timer = activeTimers.get(gameId);
    if (timer) {
        clearTimeout(timer);
        activeTimers.delete(gameId);
    }
}

export function setQuestionStartTime(gameId: string, startTime: number): void {
    questionStartTimes.set(gameId, startTime);
}


export function getQuestionStartTime(gameId: string): number | undefined {
    return questionStartTimes.get(gameId);
}

export function clearQuestionStartTime(gameId: string): void {
    questionStartTimes.delete(gameId);
}

export function getElapsedTime(gameId: string, answerTimestamp: number): number | undefined {
    const startTime = questionStartTimes.get(gameId);
    if (!startTime) return undefined;
    return answerTimestamp - startTime;
}

export function setPausedRemainingTime(gameId: string, remainingTimeMs: number): void {
    pausedRemainingTime.set(gameId, remainingTimeMs);
}


export function getPausedRemainingTime(gameId: string): number | undefined {
    return pausedRemainingTime.get(gameId);
}

export function clearPausedRemainingTime(gameId: string): void {
    pausedRemainingTime.delete(gameId);
}