export class AppError extends Error {
    constructor(
      message: string,
      public statusCode: number,
      public originalError?: Error
    ) {
      super(message);
      this.name = 'AppError';
    }
  }