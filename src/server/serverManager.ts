import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { log } from '../logger/logger.js';
import { scheduleBackup } from '../cron/backupScheduler.js';

export function startServer(serverDir: string): ChildProcessWithoutNullStreams {
    const server = spawn('java', ['-Xms4G', '-Xmx4G', '-jar', 'server.jar', 'nogui'], {
        cwd: serverDir,
        stdio: ['pipe', 'pipe', 'pipe']
    });

    server.on('close', (code: number) => {
        log(`Servidor encerrado com código ${code}`);
        process.exit(code);
    });

    return server;
}

export function setupServerListeners(server: ChildProcessWithoutNullStreams, backupDir: string, worldDir: string): void {
    let buffer: string = '';

    server.stdout.on('data', (data: Buffer) => {
        buffer += data.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        lines.forEach(line => {
            if (line.trim()) {
                console.log(line.trim());
            }
        });

        if (lines.some(line => line.includes('Done'))) {
            scheduleBackup(worldDir, backupDir);
            log('Servidor iniciado e pronto para receber comandos.');
        }
    });

    server.stderr.on('data', (data: Buffer) => {
        console.error(data.toString().trim());
    });
}
