export interface UserCredentials {
  username: string;
  password: string;
}

export type UserRole =
  | 'standard'
  | 'locked_out'
  | 'problem'
  | 'performance_glitch'
  | 'error'
  | 'visual';

export interface TestUser extends UserCredentials {
  role: UserRole;
  description: string;
}
