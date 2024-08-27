export function log(...msg: string[]): void {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    let msgTemplate = `[${hours}:${minutes}:${seconds}] [Server Backup Service]:`;

    msg.forEach((m) => {
        msgTemplate += ` ${m}`;
    });

    console.log(msgTemplate);
}
