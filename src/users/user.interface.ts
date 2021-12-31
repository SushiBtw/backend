export interface PartialUser {
    id: string;
    username: string;
    avatar_url: string;
    bot: boolean;
    flags: string[];
    tag: string;
    custom_status: string;
    status: 'ONLINE' | 'DND' | 'IDLE' | 'UNAVAILABLE';
    created_at: number;
}
export interface User extends PartialUser {
    email: string;
    password: string;
    verified: boolean;
    token: string;
}
