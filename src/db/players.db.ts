import { WebSocket } from 'ws';
import { Player } from '../types/core';
import { games } from './games.db';

export const players = new Map<string, Player>();

export const sessions = new Map<WebSocket, { name: string; index: string }>();

export const playerToWs = new Map<string, WebSocket>();

export function getPlayer(playerIndex: string): Player | undefined {
    return players.get(playerIndex);
}

export function getPlayerByName(name: string): Player | undefined {
    for (const player of players.values()) {
        if (player.name === name) {
            return player;
        }
    }
    return undefined;
}

export function savePlayer(player: Player): void {
    players.set(String(player.index), player);
}

export function deletePlayer(playerIndex: string): boolean {
    return players.delete(playerIndex);
}

export function isPlayerNameExists(name: string): boolean {
    for (const player of players.values()) {
        if (player.name === name) {
            return true;
        }
    }
    return false;
}

export function updatePlayerScore(playerIndex: string, newScore: number): boolean {
    const player = players.get(playerIndex);
    if (!player) return false;
    
    player.score = newScore;
    players.set(playerIndex, player);
    
    for (const game of games.values()) {
        const gamePlayer = game.players.find(p => String(p.index) === playerIndex);
        if (gamePlayer) {
            gamePlayer.score = newScore;
        }
    }
    
    return true;
}

export function getAllPlayers(): Player[] {
    return Array.from(players.values());
}


export function clearAllPlayers(): void {
    players.clear();
}


export function saveSession(ws: WebSocket, name: string, index: string): void {
    sessions.set(ws, { name, index });
    playerToWs.set(index, ws);
}

export function getSession(ws: WebSocket): { name: string; index: string } | undefined {
    return sessions.get(ws);
}

export function getWebSocketByPlayerIndex(playerIndex: string): WebSocket | undefined {
    return playerToWs.get(playerIndex);
}

export function getPlayerByWs(ws: WebSocket): { name: string; index: string } | undefined {
    return sessions.get(ws);
}

export function hasActiveSession(playerIndex: string): boolean {
    return playerToWs.has(playerIndex);
}

export function deleteSession(ws: WebSocket): void {
    const session = sessions.get(ws);
    if (session) {
        playerToWs.delete(session.index);
        sessions.delete(ws);
    }
}

export function deleteSessionByPlayerIndex(playerIndex: string): void {
    const ws = playerToWs.get(playerIndex);
    if (ws) {
        sessions.delete(ws);
        playerToWs.delete(playerIndex);
    }
}

export function getAllSessions(): Array<{ ws: WebSocket; name: string; index: string }> {
    const result: Array<{ ws: WebSocket; name: string; index: string }> = [];
    for (const [ws, { name, index }] of sessions.entries()) {
        result.push({ ws, name, index });
    }
    return result;
}

export function clearAllSessions(): void {
    sessions.clear();
    playerToWs.clear();
}