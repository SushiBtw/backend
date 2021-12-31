import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { RethinkService } from './rethink/rethink.service';
import { RethinkModule } from './rethink/rethink.module';
import { RethinkProvider } from './rethink/rethink';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [UsersModule, RethinkModule, ConfigModule.forRoot()],
  controllers: [AppController, UsersController],
  providers: [AppService, RethinkService, RethinkProvider],
})
export class AppModule {}
