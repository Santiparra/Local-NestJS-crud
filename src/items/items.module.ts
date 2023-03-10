import { Module } from '@nestjs/common';
import { ItemsController } from './controllers/items.controller';
import { ItemsService } from './services/items.service';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService]
})
export class ItemsModule {}
