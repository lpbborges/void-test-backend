import { env } from '../env';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Player } from '@/players/entities/player.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  entities: [Player],
  synchronize: env.NODE_ENV === 'dev',
  autoLoadEntities: true,
};
