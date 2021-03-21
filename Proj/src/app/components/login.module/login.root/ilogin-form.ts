export interface ILogingFrom {
  errorText: string;
  asyncStart: boolean;
  login: string;
  password: string;
  errorEvent(error: string): void;
}