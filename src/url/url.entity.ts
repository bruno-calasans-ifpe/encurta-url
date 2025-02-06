import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullUrl: string;

  @Column()
  shortUrl: string;

  @Column()
  redirectUrl: string;
}
