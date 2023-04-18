import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 78, unique: true })
  puuid: string;

  @Column('varchar', { length: 63, unique: true })
  summonerId: string;

  @Column()
  summonerName: string;

  @Column()
  summonerRegion: string;
}
