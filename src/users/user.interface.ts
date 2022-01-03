export interface UserRegisterDto {
    username: string;
    email: string;
    password: string;
}
export type UserDto = Omit<UserRegisterDto, "username">;
export interface PartialUser {
    id: string;
    username: string;
    avatar_url: string;
    bot: boolean;
    flags: string[];
    tag: string;
    activity: string;
    status: 'ONLINE' | 'DND' | 'IDLE' | 'UNAVAILABLE';
    created_timestamp: number;
}
export interface User extends PartialUser {
    email: string;
    password: string;
    verified: boolean;
    token: string;
    guilds: string[];
    friend_requests: {
        incoming: string[];
        outgoing: string[];
    }
    friends: string[];
}
