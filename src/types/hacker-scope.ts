import { BotStrategy, INCOMING_MESSAGES, OUTGOING_MESSAGES } from '@/constants/game-constants';
import { Question } from './core';
import { BaseMessage } from './incoming';
import { BaseResponse } from './outgoing';


export type AddBotMessage = BaseMessage<typeof INCOMING_MESSAGES.ADD_BOT, {
    gameId: string;
}>;

export interface BotConfig {
    namePrefix: string;
    answerDelayMs: number;
    strategy: BotStrategy;
}

export type PauseGameMessage = BaseMessage<typeof INCOMING_MESSAGES.PAUSE_GAME, {
    gameId: string;
}>;

export type ResumeGameMessage = BaseMessage<typeof INCOMING_MESSAGES.RESUME_GAME, {
    gameId: string;
}>;

export type GamePausedBroadcast = BaseResponse<typeof OUTGOING_MESSAGES.GAME_PAUSED, {
    gameId: string;
    remainingTimeMs?: number;
}>;

export type GameResumedBroadcast = BaseResponse<typeof OUTGOING_MESSAGES.GAME_RESUMED, {
    gameId: string;
}>;

export type ExportQuestionsMessage = BaseMessage<typeof INCOMING_MESSAGES.EXPORT_QUESTIONS, {
    gameId: string;
}>;

export type ImportQuestionsMessage = BaseMessage<typeof INCOMING_MESSAGES.IMPORT_QUESTIONS, {
    gameId: string;
    schemaVersion: number;
    questions: Question[];
}>;

export type QuestionsExportedResponse = BaseResponse<typeof OUTGOING_MESSAGES.QUESTIONS_EXPORTED, {
    schemaVersion: number;
    questions: Question[];
}>;

export type QuestionsImportedResponse = BaseResponse<typeof OUTGOING_MESSAGES.QUESTIONS_IMPORTED, {
    gameId: string;
    totalQuestions: number;
}>;

export type HackerScopeIncomingMessage = 
    | AddBotMessage
    | PauseGameMessage
    | ResumeGameMessage
    | ExportQuestionsMessage
    | ImportQuestionsMessage;

export type HackerScopeOutgoingMessage = 
    | GamePausedBroadcast
    | GameResumedBroadcast
    | QuestionsExportedResponse
    | QuestionsImportedResponse;