import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password_123'),
  compare: jest.fn(),
}));

describe('AuthService Unit Tests', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<Partial<UsersService>>;
  let jwtService: jest.Mocked<Partial<JwtService>>;
  let emailService: jest.Mocked<Partial<EmailService>>;
  let configService: jest.Mocked<Partial<ConfigService>>;

  const mockUser: any = {
    _id: { toString: () => 'user123_id' },
    name: 'Nageswari',
    email: 'nageswari@email.com',
    password: 'hashed_password_123',
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      saveResetToken: jest.fn(),
      findByResetToken: jest.fn(),
      updatePasswordAndClearToken: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked_jwt_token'),
    };

    emailService = {
      sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
    };

    configService = {
      get: jest.fn().mockReturnValue('http://localhost:3000'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: EmailService, useValue: emailService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user and return user object with JWT token', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.register({
        name: 'Nageswari',
        email: 'nageswari@email.com',
        password: 'Password123!',
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith('nageswari@email.com');
      expect(usersService.create).toHaveBeenCalled();
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('nageswari@email.com');
      expect(result.accessToken).toBe('mocked_jwt_token');
    });

    it('should throw ConflictException if user email already exists', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        authService.register({
          name: 'Nageswari',
          email: 'nageswari@email.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should authenticate valid credentials and return JWT token', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login({
        email: 'nageswari@email.com',
        password: 'Password123!',
      });

      expect(result.accessToken).toBe('mocked_jwt_token');
      expect(result.user.email).toBe('nageswari@email.com');
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({
          email: 'nageswari@email.com',
          password: 'WrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'unknown@email.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    it('should generate reset token and send email for an existing user request', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (usersService.saveResetToken as jest.Mock).mockResolvedValue(undefined);
      (emailService.sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.forgotPassword({
        email: 'nageswari@email.com',
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith('nageswari@email.com');
      expect(usersService.create).not.toHaveBeenCalled();
      expect(usersService.saveResetToken).toHaveBeenCalledWith(
        'user123_id',
        expect.any(String),
        expect.any(Date),
      );
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        'nageswari@email.com',
        'Nageswari',
        expect.stringContaining('token='),
      );
      expect(result).toEqual({
        success: true,
        message: 'If an account exists for this email, password reset instructions have been sent.',
      });
    });

    it('should not create user or reset token and return generic success for non-existing user reset request', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await authService.forgotPassword({
        email: 'nonexistent@email.com',
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith('nonexistent@email.com');
      expect(usersService.create).not.toHaveBeenCalled();
      expect(usersService.saveResetToken).not.toHaveBeenCalled();
      expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        message: 'If an account exists for this email, password reset instructions have been sent.',
      });
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password for valid token', async () => {
      (usersService.findByResetToken as jest.Mock).mockResolvedValue(mockUser);
      (usersService.updatePasswordAndClearToken as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.resetPassword({
        token: 'valid_reset_token',
        password: 'NewSecurePassword123!',
      });

      expect(usersService.findByResetToken).toHaveBeenCalledWith('valid_reset_token');
      expect(usersService.updatePasswordAndClearToken).toHaveBeenCalledWith(
        'user123_id',
        'hashed_password_123',
      );
      expect(result).toEqual({
        success: true,
        message: 'Password reset successful. You may now log in with your new password.',
      });
    });

    it('should throw BadRequestException for invalid token', async () => {
      (usersService.findByResetToken as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.resetPassword({
          token: 'invalid_token',
          password: 'NewSecurePassword123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for expired token', async () => {
      (usersService.findByResetToken as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.resetPassword({
          token: 'expired_token',
          password: 'NewSecurePassword123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
