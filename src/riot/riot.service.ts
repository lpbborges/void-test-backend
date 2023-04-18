import axios, { AxiosInstance } from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';

import { env } from '@/env';

import { parsePlatformToRegionalRoutings } from './utils/parse-platform-to-regional-routings';

@Injectable()
export class RiotService {
  private riotApiClient: AxiosInstance;
  private logger: Logger;

  constructor() {
    this.riotApiClient = axios.create({
      headers: {
        'X-Riot-Token': env.RIOT_TOKEN,
      },
    });
    this.logger = new Logger(RiotService.name);
  }

  async findSummonerByNameAndRegion(
    summonerName: string,
    summonerRegion: string,
  ) {
    this.logger.log('[findSummonerByNameAndRegion]');
    const { data } = await this.riotApiClient.get(
      `https://${summonerRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
    );

    const summonerResponseSchema = z.object({
      puuid: z.string().length(78),
      id: z.string().max(63),
    });

    return { summoner: summonerResponseSchema.parse(data) };
  }

  async findMatchesIdsBySummonerPUUID(
    summonerPUUID: string,
    summonerRegion: string,
    start: number,
    count: number,
    queue: number,
  ) {
    this.logger.log('[findMatchesIdsBySummonerPUUID]');
    const region = parsePlatformToRegionalRoutings(summonerRegion);

    const response = await this.riotApiClient.get(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${summonerPUUID}/ids`,
      {
        params: {
          start,
          count,
          queue,
        },
      },
    );

    return { matchesIds: response.data };
  }

  async findMatchById(matchId: string, summonerRegion: string) {
    this.logger.log('[findMatchById]');
    const region = parsePlatformToRegionalRoutings(summonerRegion);

    const { data } = await this.riotApiClient.get(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
    );

    const matchResponseSchema = z.object({
      metadata: z.object({
        matchId: z.string(),
      }),
      info: z.object({
        participants: z.array(
          z.object({
            puuid: z.string().length(78),
            championName: z.string(),
            win: z.boolean(),
            challenges: z.object({
              kda: z.number(),
            }),
            kills: z.number(),
            assists: z.number(),
            item0: z.number(),
            item1: z.number(),
            item2: z.number(),
            item3: z.number(),
            item4: z.number(),
            item5: z.number(),
            item6: z.number(),
            spell1Casts: z.number(),
            spell2Casts: z.number(),
            spell3Casts: z.number(),
            spell4Casts: z.number(),
          }),
        ),
      }),
    });

    return { match: matchResponseSchema.parse(data) };
  }

  async findLeagueBySummonerId(summonerId: string, summonerRegion: string) {
    this.logger.log('[findLeagueBySummonerId]');
    const { data } = await this.riotApiClient.get(
      `https://${summonerRegion}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
    );

    const leaguesSchema = z.array(
      z.object({
        rank: z.string(),
        leaguePoints: z.number(),
        wins: z.number(),
        losses: z.number(),
        leagueId: z.string(),
        queueType: z.string(),
        tier: z.string(),
        summonerId: z.string().max(63),
        summonerName: z.string(),
      }),
    );

    return leaguesSchema.parse(data);
  }
}
