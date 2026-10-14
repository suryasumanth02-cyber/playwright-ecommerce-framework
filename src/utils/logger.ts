export class Logger {
  private static formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  static info(message: string): void {
    console.log(`\x1b[36m${this.formatMessage('INFO', message)}\x1b[0m`);
  }

  static success(message: string): void {
    console.log(`\x1b[32m${this.formatMessage('PASS', message)}\x1b[0m`);
  }

  static warn(message: string): void {
    console.warn(`\x1b[33m${this.formatMessage('WARN', message)}\x1b[0m`);
  }

  static error(message: string, error?: unknown): void {
    console.error(`\x1b[31m${this.formatMessage('FAIL', message)}\x1b[0m`, error || '');
  }

  static step(stepNumber: number, description: string): void {
    console.log(`\x1b[35m[STEP ${stepNumber}] ===> ${description}\x1b[0m`);
  }
}
