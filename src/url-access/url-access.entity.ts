import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UrlAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accessDate: Date;

  @Column()
  ip: string;

  @Column({ default: 1 })
  clicks: number;
}
