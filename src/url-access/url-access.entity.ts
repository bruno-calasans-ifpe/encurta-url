import { Url } from 'src/url/url.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class UrlAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accessDate: string;

  @Column()
  ip: string;

  @Column()
  location: string;

  @ManyToOne(() => Url, (url) => url.accesses, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'url_id' })
  url: Url;
}
