import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    const newUser = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email.toLowerCase(),
      password: hashedPassword,
    });

    const payload = { sub: newUser._id.toString(), email: newUser.email, name: newUser.name };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
      },
      accessToken,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user._id.toString(), email: user.email, name: user.name };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      accessToken,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 3600000); // 1 hour

      await this.usersService.saveResetToken(user._id.toString(), resetToken, resetExpires);

      const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
      const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

      try {
        await this.emailService.sendPasswordResetEmail(user.email, user.name, resetUrl);
        this.logger.log(`Password reset email dispatched successfully to ${user.email}`);
      } catch (err: any) {
        this.logger.error(`Error sending password reset email: ${err.message}`);
      }
    }

    return {
      success: true,
      message: 'If an account with that email exists, password reset instructions have been sent.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByResetToken(resetPasswordDto.token);
    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, saltRounds);

    await this.usersService.updatePasswordAndClearToken(user._id.toString(), hashedPassword);

    return {
      success: true,
      message: 'Password reset successful. You may now log in with your new password.',
    };
  }
}
