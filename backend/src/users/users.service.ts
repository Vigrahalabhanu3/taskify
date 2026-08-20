import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: Partial<User>): Promise<UserDocument> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const escaped = cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.userModel
      .findOne({
        $or: [
          { email: cleanEmail },
          { email: { $regex: `^${escaped}$`, $options: 'i' } },
        ],
      })
      .select('+password')
      .exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByResetToken(token: string): Promise<UserDocument | null> {
    if (!token) return null;
    const cleanToken = decodeURIComponent(token.trim());

    let user = await this.userModel
      .findOne({
        $or: [
          { resetPasswordToken: cleanToken },
          { resetPasswordToken: token.trim() },
        ],
      })
      .select('+password')
      .exec();

    if (user && user.resetPasswordExpires) {
      const expiresTime = new Date(user.resetPasswordExpires).getTime();
      if (expiresTime < Date.now()) {
        return null;
      }
    }

    return user;
  }

  async saveResetToken(userId: string, token: string, expires: Date): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $set: { resetPasswordToken: token, resetPasswordExpires: expires },
      })
      .exec();
  }

  async updatePasswordAndClearToken(userId: string, hashedPassword: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $set: { password: hashedPassword },
        $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 },
      })
      .exec();
  }
}
