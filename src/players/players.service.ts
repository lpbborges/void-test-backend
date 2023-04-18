import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import { RiotService } from '@/riot/riot.service';
import { PlayerNotFoundError } from '@/errors/PlayerNotFoundError';
import { QueueEnum } from '@/enums/QueueEnum';
import { PlayersRepository } from './players.repository';

@Injectable()
export class PlayersService {
  private logger: Logger;

  constructor(
    private readonly riotService: RiotService,
    private readonly playersRepository: PlayersRepository,
  ) {
    this.logger = new Logger(PlayersService.name);
  }

  async findBySummonerNameAndRegion(
    summonerName: string,
    summonerRegion: string,
  ) {
    const player = await this.playersRepository.findBySummonerNameAndRegion(
      summonerName,
      summonerRegion,
    );

    if (player) {
      return { player };
    }

    const { summoner } = await this.riotService.findSummonerByNameAndRegion(
      summonerName,
      summonerRegion,
    );

    this.logger.log('summoner', summoner);

    if (!summoner) {
      throw new PlayerNotFoundError();
    }

    const newPlayer = await this.playersRepository.create({
      puuid: summoner.puuid,
      summonerId: summoner.id,
      summonerName,
      summonerRegion,
    });

    return { player: newPlayer };
  }

  async findMatchesBySummonerNameAndRegion(
    summonerName: string,
    summonerRegion: string,
    page: number,
    size: number,
    queue: number,
  ) {
    const { player } = await this.findBySummonerNameAndRegion(
      summonerName,
      summonerRegion,
    );

    const { matchesIds } = await this.riotService.findMatchesIdsBySummonerPUUID(
      player.puuid,
      summonerRegion,
      page - 1,
      size,
      queue,
    );

    const matches = [];

    for await (const matchId of matchesIds) {
      const { match } = await this.riotService.findMatchById(
        matchId,
        summonerRegion,
      );

      const playerParticipant = match.info.participants.find(
        (participant) => participant.puuid === player.puuid,
      );

      const kda = playerParticipant.challenges.kda;
      let spellsCount = 0;
      for (const key in playerParticipant) {
        if (key.match(/spell[1-4]Casts/)) {
          spellsCount += playerParticipant[key];
        }
      }

      const playerMatch = {
        matchId: match.metadata.matchId,
        ...playerParticipant,
        kda,
        spellsCount,
      };

      const playerMatchSchema = z.object({
        matchId: z.string(),
        puuid: z.string().length(78),
        championName: z.string(),
        win: z.boolean(),
        kda: z.number(),
        kills: z.number(),
        assists: z.number(),
        spellsCount: z.number(),
      });

      matches.push(playerMatchSchema.parse(playerMatch));
    }

    return { matches };
  }

  async summaryBySummonerNameAndRegion(
    summonerName: string,
    summonerRegion: string,
    queue?: number,
  ) {
    const { player } = await this.findBySummonerNameAndRegion(
      summonerName,
      summonerRegion,
    );

    const leagues = await this.riotService.findLeagueBySummonerId(
      player.summonerId,
      summonerRegion,
    );

    if (queue) {
      return {
        summary: leagues.filter(
          (league) => !queue || QueueEnum[league.queueType] === Number(queue),
        ),
      };
    }

    return { summary: leagues };
  }
}
