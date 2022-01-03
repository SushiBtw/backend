import {Module} from '@nestjs/common';
import { UsersService } from './users.service';
import {RethinkProvider} from "../rethink/rethink";

@Module({
  providers: [UsersService, RethinkProvider]
})
export class UsersModule {}
