import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserCreateData, UserUpdateData } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: UserCreateData) {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async update(id: number, data: UserUpdateData) {
    return this.userRepository.update(id, data);
  }

  async delete(id: number) {
    return this.userRepository.delete(id);
  }

  async get(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async getByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async getAll() {
    return this.userRepository.find();
  }
}
