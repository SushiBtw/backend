import {Injectable, Logger} from '@nestjs/common';
import * as Mailer from '@sendgrid/mail'
import {ConfigService} from "@nestjs/config";

@Injectable()
export class MailerService {
    constructor(private readonly configService: ConfigService) {
        Mailer.setApiKey(this.configService.get('SENDGRID_API_KEY'));
    }
    async send(mail: Mailer.MailDataRequired) {
        const result = await Mailer.send(mail);
        Logger.log(result, 'MailerService');
        return result;
    }
}
