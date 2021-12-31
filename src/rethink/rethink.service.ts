import {Inject, Injectable} from '@nestjs/common';
import * as r from 'rethinkdb';

@Injectable()
export class RethinkService {
    private conn: r.Connection;
    constructor(@Inject('RethinkProvider') private readonly rethinkProvider: r.Connection) {
        this.conn = rethinkProvider;
    }

}