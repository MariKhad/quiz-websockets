import { Question } from './core';
import { BaseMessage } from './incoming';
import { BaseResponse } from './outgoing';

export type AddBotMessage = BaseMessage<'add_bot', {
    gameId: string;
}>;

export interface BotConfig {
    namePrefix: string;
    answerDelayMs: number;
    strategy: 'random' | 'smart';
}

export type PauseGameMessage = BaseMessage<'pause_game', {
    gameId: string;
}>;

export type ResumeGameMessage = BaseMessage<'resume_game', {
    gameId: string;
}>;

export type GamePausedBroadcast = BaseResponse<'game_paused', {
    gameId: string;
    remainingTimeMs?: number;
}>;

export type GameResumedBroadcast = BaseResponse<'game_resumed', {
    gameId: string;
}>;

export type ExportQuestionsMessage = BaseMessage<'export_questions', {
    gameId: string;
}>;

export type ImportQuestionsMessage = BaseMessage<'import_questions', {
    gameId: string;
    schemaVersion: number;
    questions: Question[];
}>;

export type QuestionsExportedResponse = BaseResponse<'questions_exported', {
    schemaVersion: number;
    questions: Question[];
}>;

export type QuestionsImportedResponse = BaseResponse<'questions_imported', {
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