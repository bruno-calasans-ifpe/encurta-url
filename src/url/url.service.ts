import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { UrlCreateData, UrlUpdateData } from './url.dto';
const short = require('short-uuid');

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}

  generateShortUrl(redirectUrl: string) {
    return redirectUrl.concat(short.generate().toString());
  }

  async create(data: UrlCreateData) {
    const newUrl = this.urlRepository.create(data);
    return this.urlRepository.save(newUrl);
  }

  async update(id: number, data: UrlUpdateData) {
    return this.urlRepository.update(id, data);
  }

  async delete(id: number) {
    return this.urlRepository.delete(id);
  }

  async get(id: number) {
    return this.urlRepository.findOne({
      where: { id },
      relations: { user: false },
    });
  }

  async getByShortUrl(shortUrl: string) {
    return this.urlRepository.findOne({
      where: { shortUrl },
    });
  }

  async getAll() {
    return this.urlRepository.find();
  }
}
