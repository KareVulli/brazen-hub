declare module "#auth-utils" {
  interface User {
    discordId: string;
    username: string;
    displayName: string;
    avatar: string;
    role: number;
  }
}

export {};
