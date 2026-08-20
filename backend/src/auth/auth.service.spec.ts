import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
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
});
