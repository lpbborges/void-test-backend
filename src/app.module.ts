import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './database';
import { RiotService } from './riot/riot.service';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), PlayersModule],
  providers: [RiotService],
})
export class AppModule {}
