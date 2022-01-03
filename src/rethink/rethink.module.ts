import { Module } from '@nestjs/common';
import {RethinkProvider} from "./rethink";

@Module({
    imports: [],
    controllers: [],
    providers: [RethinkProvider],
    exports: [RethinkProvider]
})
export class RethinkModule {}
