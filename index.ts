import * as readline from 'readline';
import { startServer, setupServerListeners } from './src/server/serverManager.js';
import { sendCommandToServer } from './src/commands/serverCommands.js';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const serverDir: string = process.env.SERVER_DIR ?? '';
const worldDir: string = path.join(serverDir, 'world');
const backupDir: string = path.join(serverDir, 'backups');

export const server = startServer(serverDir);
setupServerListeners(server, backupDir, worldDir);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input: string) => {
    sendCommandToServer(input.trim());
});
