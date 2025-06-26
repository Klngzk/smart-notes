// types/global.d.ts or somewhere global
declare namespace Express {
  interface Request {
    user?: {
      userId: string;
      email: string;
    };
  }
}
