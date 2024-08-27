import * as cron from 'node-cron';
import { backupWorld } from '../backup/backupManager.js';
import { log } from '../logger/logger.js';

export function scheduleBackup(worldDir: string, backupDir: string, sendCommandToServer: (command: string) => void): void {
    cron.schedule(process.env.BACKUP_SCHEDULE ?? '*/30 * * * *', () => backupWorld(worldDir, backupDir, sendCommandToServer));
    log('Cronograma de backup iniciado');
}
