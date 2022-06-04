export class Login {
  constructor(public username: string, public password: string) {
  }
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokeExpire: number;
}
