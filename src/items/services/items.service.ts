import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { Item } from '../entities/item.entity';

@Injectable()
export class ItemsService {

  private readonly logger = new Logger(ItemsService.name);

  items: Item[] =[
    {id: 0, itemName: "item1"},
    {id: 1, itemName: "item2"},
    {id: 2, itemName: "item3"}, 
  ]  

  removeItem( id: number ): Item[] {
    this.items = this.items.filter(item => item.id !== id);
    return this.items;
  }

  updateItem( id: number, updateItemDto: UpdateItemDto ): Item[] {
    let item = this.findItemByID(id);
    const index = this.items.indexOf ( item[0] );
    if ( !item || index == -1 ) throw new NotFoundException("Este item no se encuentra en la base de datos");
    item[0] = {...item[0], ...updateItemDto};
    this.items.splice(index, 1, item[0]);
    return item
  }

  replaceItem(id: number, createItemDto: CreateItemDto): Item[] {
    let item = this.findItemByID(id);    
    const index = this.items.indexOf ( item[0] );
    if ( !item || index == -1 ) this.createItem(createItemDto);
    item[0] = {...item[0], ...createItemDto};
    this.items.splice(index, 1, item[0]);
    return item
  }

  createItem( createItemDto: CreateItemDto ): Item {
    let id = this.generateId();
    let item = { ...createItemDto, id: id };    
    this.items.push(item);
    return item
  }

  findItemByID( id: number ): Item[] {
    const item = this.items.filter(esto => esto.id === id);
    return item   
  }

  findAllItems(): Item[] {
    return this.items;
  }

  generateId(): number {
    let randomId = Math.floor(Math.random() * 101);
    this.items.forEach((item) => {
      if (item.id === randomId) this.generateId()
    })
    return randomId
  }
  
}
