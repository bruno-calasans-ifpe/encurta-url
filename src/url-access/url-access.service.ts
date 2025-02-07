import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlAccess } from './url-access.entity';
import { CreateAccessUrlData, UpdateAccessUrlData } from './url-access.dto';

@Injectable()
export class UrlAccessService {
  constructor(
    @InjectRepository(UrlAccess)
    private urlaccessRepository: Repository<UrlAccess>,
  ) {}

  async create(data: CreateAccessUrlData) {
    const newUrlAccess = this.urlaccessRepository.create(data);
    return this.urlaccessRepository.save(newUrlAccess);
  }

  async update(id: number, data: UpdateAccessUrlData) {
    return this.urlaccessRepository.update(id, data);
  }

  async delete(id: number) {
    return this.urlaccessRepository.delete(id);
  }

  async get(id: number) {
    return this.urlaccessRepository.findOne({
      where: { id },
      relations: { url: true },
    });
  }

  async getAll() {
    return this.urlaccessRepository.find({ relations: { url: true } });
  }
}
