import { deleteSession, sessions } from '../db/players.db';
import { WebSocket } from 'ws';

export function handleConnection(ws: WebSocket): void {

    ws.on('message', (data: Buffer) => {
        handleMessage(ws, data);
    });
    
    ws.on('close', (code: number, reason: Buffer) => {
        handleClose(ws, code, reason);
    });
    
    ws.on('error', (error: Error) => {
        handleError(ws, error);
    });
    
    ws.send(JSON.stringify({
        type: 'welcome',
        data: {
            message: 'Connected to Live Quiz Game Server',
            timestamp: Date.now()
        },
        id: 0
    }));
}


function handleMessage(ws: WebSocket, data: Buffer): void {
    try {
        const messageStr = data.toString();
        console.log(`[Message] Received: ${messageStr}`);
        
        const message = JSON.parse(messageStr);

        if (!message.type || message.id !== 0) {
            throw new Error('Invalid message format: missing type or id !== 0');
        }
        
        // TODO: Здесь будет диспетчер сообщений (messageHandler)
        // Пока просто логируем
        console.log(`[Message] Type: ${message.type}, Data:`, message.data);
        
        ws.send(JSON.stringify({
            type: 'error',
            data: {
                error: true,
                errorText: `Unknown message type: ${message.type}`
            },
            id: 0
        }));
        
    } catch (error) {
        console.error('[Message Error]', error);
        
        // Отправляем ошибку клиенту
        ws.send(JSON.stringify({
            type: 'error',
            data: {
                error: true,
                errorText: error instanceof Error ? error.message : 'Invalid message format'
            },
            id: 0
        }));
    }
}


function handleClose(ws: WebSocket, code: number, reason: Buffer): void {
    const reasonStr = reason.toString();
    console.log(`[Close] Connection closed - Code: ${code}, Reason: ${reasonStr || 'No reason provided'}`);
    
    const session = sessions.get(ws);
    
    if (session) {
        console.log(`[Close] Player disconnected: ${session.name} (${session.index})`);
        
        handlePlayerDisconnect(session.index);
        
        deleteSession(ws);
        console.log(`[Close] Session removed for player: ${session.name}`);
    } else {
        console.log('[Close] Unregistered client disconnected');
    }
}

function handleError(ws: WebSocket, error: Error): void {
    console.error('[WebSocket Error]', error.message);

    const session = sessions.get(ws);
    if (session) {
        console.error(`[WebSocket Error] Player: ${session.name} (${session.index})`, error.stack);
    }
    
    if (error.message.includes('unexpected')) {
        ws.close(1011, 'Unexpected error');
    }
}

function handlePlayerDisconnect(playerIndex: string): void {
    // TODO: Реализовать логику:
    // 1. Найти все игры, где участвует игрок
    // 2. Удалить игрока из этих игр
    // 3. Отправить обновленный список игроков всем оставшимся
    // 4. Если игра в процессе, игрок считается не ответившим
    
    console.log(`[Disconnect] Player ${playerIndex} disconnected - cleanup will be implemented later`);
    
    // Пока просто заглушка
    // В будущем здесь будет:
    // const games = getGamesByPlayer(playerIndex);
    // for (const game of games) {
    //     removePlayerFromGame(game.id, playerIndex);
    //     broadcastUpdatePlayers(game.id);
    // }
}