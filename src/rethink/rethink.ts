import * as r from 'rethinkdb';

export const RethinkProvider = {
    provide: 'RethinkProvider',
    useFactory: async () => {
        return await r.connect({
            db: process.env.DB_NAME
        });
    }
}