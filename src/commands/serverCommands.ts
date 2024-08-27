import { log } from '../logger/logger.js';
import { server } from '../../index.js';

export function sendCommandToServer(command: string): void {
    if (server.stdin) {
        log('Enviando comando:', command);
        server.stdin.write(`${command}\n`);
    } else {
        log('Servidor não iniciado corretamente.');
    }
}
