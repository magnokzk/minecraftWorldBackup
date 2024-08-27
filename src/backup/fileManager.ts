import { promises as fsPromises, Stats } from 'fs';
import * as path from 'path';

export const countBackupFiles = async (backupDir: string): Promise<number> => {
    try {
        return (await fsPromises.readdir(backupDir)).length;
    } catch (err) {
        console.error('Erro ao contar arquivos e diretórios:', err);
        return 0;
    }
};

export const deleteOldestFile = async (backupDir: string, log: (...msg: string[]) => void): Promise<void> => {
    try {
        const files = await fsPromises.readdir(backupDir);
        if (files.length === 0) {
            log('Nenhum arquivo ou diretório encontrado para excluir.');
            return;
        }

        const sortedFiles = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(backupDir, file);
                const stats: Stats = await fsPromises.stat(filePath);
                return { file, mtime: stats.mtime, isDirectory: stats.isDirectory() };
            })
        );

        sortedFiles.sort((a, b) => a.mtime.getTime() - b.mtime.getTime());

        const directories = sortedFiles.filter(item => item.isDirectory);

        if (directories.length === 0) {
            log('Nenhum diretório encontrado para excluir.');
            return;
        }

        const oldestDirectory = directories[0];
        const oldestDirectoryPath = path.join(backupDir, oldestDirectory.file);

        await fsPromises.rm(oldestDirectoryPath, { recursive: true });
        log(`Diretório mais antigo excluído: ${oldestDirectory.file}`);
    } catch (err) {
        console.error('Erro ao excluir o diretório mais antigo:', err);
    }
};
