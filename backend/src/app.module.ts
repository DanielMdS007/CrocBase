import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from './authorization/authorization.module.js';

if (process.env.DB_HOST === undefined) {
  try {
    process.loadEnvFile();
  } catch {
    // Environment variables may be supplied by the deployment environment.
  }
}

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    AuthorizationModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,

      autoLoadEntities: true,
      synchronize: false,
    }),
  ],
})
export class AppModule {}
