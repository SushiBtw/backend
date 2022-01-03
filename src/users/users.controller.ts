import {Body, Controller, HttpException, HttpStatus, Param, Post} from '@nestjs/common';
import {User, UserDto} from "./user.interface";
import {UsersService} from "./users.service";
import isEmail from 'validator/lib/isEmail';
import isLength from "validator/lib/isLength";
import * as randomstring from "randomstring";
import * as bcrypt from 'bcrypt';
import {MailerService} from "../mailer/mailer.service";
import {ConfigService} from "@nestjs/config";

@Controller('users')
export class UsersController {
    public constructor(
        private readonly usersService: UsersService,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) {}
    @Post()
    async register(@Body() user: UserDto) {
        // Check if the email is valid
        if (!isEmail(user.email)) throw new HttpException('This email is badly formatted.', HttpStatus.BAD_REQUEST);
        // Get all users from the database
        const users: User[] = await this.usersService.getAll();
        // Check if a user with that email already exists
        if (users.find(u => u.email === user.email)) throw new HttpException('This email has already been claimed.', HttpStatus.CONFLICT);
        // Generate a random user ID and check if it is unique
        let userID = randomstring.generate(16);
        while (users.find(u => u.id === userID)) userID = randomstring.generate(16);
        // Generate a random tag and check if it is unique
        let tag = randomstring.generate(8);
        while (users.find(u => `${user.username}#${tag}` === `${u.username}#${tag}`)) tag = randomstring.generate(8);
        // Check if password is of length 6 or more
        if (!isLength(user.password, {min: 6, max: 128})) throw new HttpException('Invalid password (Password length must be between 6 and 128).', HttpStatus.BAD_REQUEST);
        // Hash the password
        const hash = await bcrypt.hash(user.password, 10);
        // Generate the token
        const token = Buffer.from(`${userID}:${hash}`).toString('base64');
        // Generate verify token
        const verifyToken = randomstring.generate({
            length: 64,
            charset: 'alphanumeric'
        });
        // User's flags
        const flags = [];
        if (users.length === 0) flags.push('ADMIN');
        // Get the user's object
        const u: User = {
            id: userID,
            username: user.username,
            email: user.email,
            password: hash,
            token,
            created_timestamp: Date.now(),
            tag,
            verified: false,
            friends: [],
            friend_requests: {
                incoming: [],
                outgoing: []
            },
            activity: 'Hi, I\'m new!',
            flags,
            guilds: [],
            bot: false,
            status: 'ONLINE',
            avatar_url: ''
        };
        // Create the user
        await this.usersService.create(u);
        // Create verify token
        await this.usersService.createVerifyToken(userID, verifyToken);
        // Send a verification email to the user
        await this.mailerService.send({
            templateId: this.configService.get('SENDGRID_TEMPLATE_ID'),
            from: this.configService.get('SENDGRID_SENDER_EMAIL'),
            to: user.email,
            subject: 'Welcome to Vanilla!',
            dynamicTemplateData: {
                username: user.username,
                verifyURL: this.configService.get('IS_DEBUG') ? `https://localhost:3000/users/verify/${verifyToken}` : `https://vanilla.ovh/users/verify/${verifyToken}`
            }
        });
        // Return the user's object
        return {user: u, token};
    }
    @Post('verify/:token')
    async verify(@Param('token') token: string) {
        // Verify the user
        const user = await this.usersService.verify(token);
        // Return the user's object
        return {user};
    }
}
