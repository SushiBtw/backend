import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { RethinkModule } from './rethink/rethink.module';
import { RethinkProvider } from './rethink/rethink';
import {ConfigModule} from "@nestjs/config";
import {UsersService} from "./users/users.service";
import { MailerService } from './mailer/mailer.service';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        cache: true
      }),
    UsersModule,
    RethinkModule
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, RethinkProvider, UsersService, MailerService],
})
export class AppModule {}
