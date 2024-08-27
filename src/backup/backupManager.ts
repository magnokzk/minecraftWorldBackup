import { exec } from 'child_process';
import * as path from 'path';
import { countBackupFiles, deleteOldestFile } from './fileManager.js';
import { log } from '../logger/logger.js';
import { sendCommandToServer } from '../commands/serverCommands.js';

export async function backupWorld(worldDir: string, backupDir: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const backupPath = path.join(backupDir, `world_backup_${timestamp}`);

    log('Realizando backup...');
    sendCommandToServer('say Iniciando backup de mapa.');
    exec(`xcopy "${worldDir}" "${backupPath}" /E /I /H /C /Y`, async (err, stdout, stderr) => {
        if (err) {
            log('Erro ao realizar backup:', stderr);
        } else {
            log('Backup realizado com sucesso:', backupPath);
            await checkBackupRemoval(backupDir);
            sendCommandToServer('say Backup realizado com sucesso!');
        }
    });
}

async function checkBackupRemoval(backupDir: string): Promise<void> {
    const count = await countBackupFiles(backupDir);
    if (count > 5) {
        await deleteOldestFile(backupDir);
        await checkBackupRemoval(backupDir);
    }
}
