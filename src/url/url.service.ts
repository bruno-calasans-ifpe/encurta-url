import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Url } from './url.entity';
import { CreateUrlData, UpdateUrlData } from './url.dto';
import ShortUniqueId from 'short-unique-id';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}

  generateShortUrl(redirectUrl: string) {
    const shortUUID = new ShortUniqueId({
      length: 6,
    }).rnd();

    //const shortPath = '/' + short.generate().toString();
    const url = new URL(shortUUID, redirectUrl);
    return url.href;
  }

  async create(data: CreateUrlData) {
    const newUrl = this.urlRepository.create(data);
    return this.urlRepository.save(newUrl);
  }

  async update(id: number, data: UpdateUrlData) {
    return this.urlRepository.update(id, data);
  }

  async delete(id: number) {
    return this.urlRepository.delete(id);
  }

  async get(id: number) {
    return this.urlRepository.findOne({
      where: { id },
      relations: { user: true, accesses: true },
    });
  }

  async getByShortUrl(shortUrl: string) {
    return this.urlRepository.findOne({
      where: { shortUrl: Like(`%${shortUrl}%`) },
      relations: { user: true, accesses: true },
    });
  }

  async getUserUrls(userId: number) {
    return this.urlRepository.find({
      where: { user: { id: userId } },
    });
  }

  async getAll() {
    return this.urlRepository.find();
  }
}
