import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {User} from "./user.interface";
import * as r from 'rethinkdb';

@Injectable()
export class UsersService {
    public constructor(@Inject('RethinkProvider') private readonly conn: r.Connection) {
        this.conn = conn;
    }
    async createVerifyToken(userID: string, token: string): Promise<r.WriteResult> {
        return await r.table('verify_tokens').insert({
            user_id: userID,
            token
        }).run(this.conn);
    }
    async verify(verify_token: string): Promise<boolean | Error> {
        const user = await r.table('verify_tokens').filter({token: verify_token}).coerceTo('array').run(this.conn);
        console.log(user);
        if (user[0]) {
            await r.table('users').filter({id: user[0].user_id}).update({verified: true}).run(this.conn);
            await r.table('verify_tokens').filter({token: verify_token}).delete().run(this.conn);
            return true;
        } else throw new NotFoundException('Verify token not found');
    }
    public async create(user: User): Promise<User> {
        await r.table('users').insert(user).run(this.conn);
        return user;
    }
    public async getAll(): Promise<User[]> {
        return await r.table('users').coerceTo('array').run(this.conn);
    }
    public async findOneById(id: string): Promise<User> {
        const users: User[] = await r.table('users').filter({id}).coerceTo('array').run(this.conn);
        return users[0];
    }
    public async findOneByEmail(email: string): Promise<User> {
        const users: User[] = await r.table('users').filter({email}).coerceTo('array').run(this.conn);
        return users[0];
    }
    public async updateById(user: User): Promise<User> {
        await r.table('users').filter({id: user.id}).update(user).run(this.conn);
        return user;
    }
    public async updateByEmail(user: User): Promise<User> {
        await r.table('users').filter({email: user.email}).update(user).run(this.conn);
        return user;
    }
    public async deleteById(id: string): Promise<User> {
        const user = await this.findOneById(id);
        await r.table('users').filter({id}).delete().run(this.conn);
        return user;
    }
    public async deleteByEmail(email: string): Promise<User> {
        const user = await this.findOneByEmail(email);
        await r.table('users').filter({email}).delete().run(this.conn);
        return user;
    }
}
