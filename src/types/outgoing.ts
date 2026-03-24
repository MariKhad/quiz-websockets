import { OUTGOING_MESSAGES } from '@/constants/game-constants';
import { Player } from './core';
import { Question } from './core';
import { PlayerResult, ScoreboardEntry } from './helpers';

export interface BaseResponse<T extends string, D = unknown> {
    type: T;
    data: D;
    id: 0;
}

export type RegResponse = BaseResponse<typeof OUTGOING_MESSAGES.REG, {
    name: string;
    index: string | number;
    error: boolean;
    errorText: string;
}>;

export type GameCreatedResponse = BaseResponse<typeof OUTGOING_MESSAGES.GAME_CREATED, {
    gameId: string;
    code: string;
}>;

export type GameJoinedResponse = BaseResponse<typeof OUTGOING_MESSAGES.GAME_JOINED, {
    gameId: string;
}>;

export type PlayerJoinedBroadcast = BaseResponse<typeof OUTGOING_MESSAGES.PLAYER_JOINED, {
    playerName: string;
    playerCount: number;
}>;

export type UpdatePlayersBroadcast = BaseResponse<typeof OUTGOING_MESSAGES.UPDATE_PLAYERS, Player[]>;

export interface QuestionBroadcastData extends Omit<Question, 'correctIndex'> {
    questionNumber: number;
    totalQuestions: number;
}

export type QuestionBroadcast = BaseResponse<typeof OUTGOING_MESSAGES.QUESTION, QuestionBroadcastData>;

export type AnswerAcceptedResponse = BaseResponse<typeof OUTGOING_MESSAGES.ANSWER_ACCEPTED, {
    questionIndex: number;
}>;

export type QuestionResultBroadcast = BaseResponse<typeof OUTGOING_MESSAGES.QUESTION_RESULT, {
    questionIndex: number;
    correctIndex: number;
    playerResults: PlayerResult[];
}>;

export type GameFinishedBroadcast = BaseResponse<typeof OUTGOING_MESSAGES.GAME_FINISHED, {
    scoreboard: ScoreboardEntry[];
}>;

export type ErrorResponse = BaseResponse<string, {
    error: true;
    errorText: string;
}>;

export type OutgoingMessage = 
    | RegResponse
    | GameCreatedResponse
    | GameJoinedResponse
    | PlayerJoinedBroadcast
    | UpdatePlayersBroadcast
    | QuestionBroadcast
    | AnswerAcceptedResponse
    | QuestionResultBroadcast
    | GameFinishedBroadcast
    | ErrorResponse;