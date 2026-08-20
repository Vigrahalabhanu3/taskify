import { Controller, Post, Get, Body, HttpCode, HttpStatus, Redirect, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.register(registerDto);
    return {
      success: true,
      message: 'User registered successfully',
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return {
      success: true,
      message: 'Login successful',
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Get('forgot-password')
  @Redirect()
  handleForgotPasswordGet() {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    return { url: `${frontendUrl}/forgot-password`, statusCode: 302 };
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('reset-password')
  @Redirect()
  handleResetPasswordGet(@Query('token') token?: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const redirectUrl = token
      ? `${frontendUrl}/reset-password?token=${token}`
      : `${frontendUrl}/reset-password`;
    return { url: redirectUrl, statusCode: 302 };
  }
}

