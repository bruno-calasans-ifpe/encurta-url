import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserData, UserUpdateData } from './user.dto';

@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserData) {
    const newUser = this.userRepository.create(data);
    const createdUser = await this.userRepository.save(newUser);

    // Remove senha do objeto usuário
    const { password, ...userWithoutPassword } = createdUser;

    return userWithoutPassword;
  }

  async update(id: number, data: UserUpdateData) {
    return this.userRepository.update(id, data);
  }

  async delete(id: number) {
    return this.userRepository.delete(id);
  }

  async get(id: number) {
    return this.userRepository.findOne({
      where: { id },
      select: { password: false },
    });
  }

  async getByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: { password: false },
    });
  }

  async getAll() {
    return this.userRepository.find({ select: { password: false } });
  }
}
