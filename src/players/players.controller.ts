import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlayersService } from './players.service';
import { QueueEnum } from '@/enums/QueueEnum';
import { z } from 'zod';

interface FindMatchesBySummonerNameAndRegionQuery {
  page: number;
  size: number;
  queue: QueueEnum;
}

@Controller('players/:summonerRegion/summoner/:summonerName')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get('matches')
  findMatchesBySummonerNameAndRegion(
    @Param('summonerRegion') summonerRegion: string,
    @Param('summonerName') summonerName: string,
    @Query() query: FindMatchesBySummonerNameAndRegionQuery,
  ) {
    const querySchema = z.object({
      page: z.coerce.number().default(1),
      size: z.coerce.number().max(100).default(20),
      queue: z.optional(z.coerce.number()),
    });

    const { page, size, queue } = querySchema.parse(query);

    return this.playersService.findMatchesBySummonerNameAndRegion(
      summonerName,
      summonerRegion,
      page,
      size,
      queue,
    );
  }

  @Get('summary')
  summaryBySummonerNameAndRegion(
    @Param('summonerRegion') summonerRegion: string,
    @Param('summonerName') summonerName: string,
    @Query('queue') queue: QueueEnum,
  ) {
    return this.playersService.summaryBySummonerNameAndRegion(
      summonerName,
      summonerRegion,
      queue,
    );
  }
}
