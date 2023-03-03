import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import { CorrelationIdMiddleware } from './middlewares/correlation-id/correlation-id.middleware';
import { loggerConfig } from './logger/logger-conf';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';


@Module({
  imports: [
    UsersModule, 
    ItemsModule, 
    AuthModule, 
    LoggerModule.forRoot(loggerConfig),
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: RolesGuard,
  }],
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes("*");
  }
}
