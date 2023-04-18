import { CreatePlayerDTO } from '../dtos/create-player.dto';
import { Player } from '../entities/player.entity';

export interface IPlayerRepository {
  create: (data: CreatePlayerDTO) => Promise<Player>;
  findBySummonerNameAndRegion: (
    summonerName: string,
    summonerRegion: string,
  ) => Promise<Player>;
}
