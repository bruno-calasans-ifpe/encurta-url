import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlAccess } from './url-access.entity';
import { UrlAccessCreateData, UrlAccessUpdateData } from './url-access.dto';

@Injectable()
export class UrlAccessService {
  constructor(
    @InjectRepository(UrlAccess)
    private urlaccessRepository: Repository<UrlAccess>,
  ) {}

  async create(urlAccess: UrlAccessCreateData) {
    const newUrlAccess = this.urlaccessRepository.create(urlAccess);
    return this.urlaccessRepository.save(newUrlAccess);
  }

  async update(id: number, data: UrlAccessUpdateData) {
    return this.urlaccessRepository.update(id, data);
  }

  async delete(id: number) {
    return this.urlaccessRepository.delete(id);
  }

  async get(id: number) {
    return this.urlaccessRepository.findOne({
      where: { id },
    });
  }

  async getAll() {
    return this.urlaccessRepository.find();
  }
}
