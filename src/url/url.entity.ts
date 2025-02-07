import { UrlAccess } from 'src/url-access/url-access.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

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

  @ManyToOne(() => User, (user) => user.urls, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => UrlAccess, (urlAccess) => urlAccess.url, {
    cascade: true,
    eager: false,
  })
  accesses: UrlAccess[];
}
