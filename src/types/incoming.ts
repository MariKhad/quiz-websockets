import { INCOMING_MESSAGES } from '../constants/game-constants';
import { Question } from './core';

export interface BaseMessage<T extends string, D = unknown> {
    type: T;
    data: D;
    id: 0;
}

export type RegMessage = BaseMessage<typeof INCOMING_MESSAGES.REG, {
    name: string;
    password: string;
}>;

export type CreateGameMessage = BaseMessage<typeof INCOMING_MESSAGES.CREATE_GAME, {
    questions: Question[];
}>;

export type JoinGameMessage = BaseMessage<typeof INCOMING_MESSAGES.JOIN_GAME, {
    code: string;
}>;

export type StartGameMessage = BaseMessage<typeof INCOMING_MESSAGES.START_GAME, {
    gameId: string;
}>;

export type AnswerMessage = BaseMessage<typeof INCOMING_MESSAGES.ANSWER, {
    gameId: string;
    questionIndex: number;
    answerIndex: number;
}>;

export type IncomingMessage = 
    | RegMessage
    | CreateGameMessage
    | JoinGameMessage
    | StartGameMessage
    | AnswerMessage;