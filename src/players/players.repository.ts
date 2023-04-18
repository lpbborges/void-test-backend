import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { IPlayerRepository } from './interfaces/player.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayersRepository implements IPlayerRepository {
  constructor(
    @InjectRepository(Player)
    private repository: Repository<Player>,
  ) {}

  create = (data: CreatePlayerDTO) => {
    return this.repository.save(data);
  };

  findBySummonerNameAndRegion = async (
    summonerName: string,
    summonerRegion: string,
  ) => {
    return this.repository.findOne({ where: { summonerName, summonerRegion } });
  };
}
