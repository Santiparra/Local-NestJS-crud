import { Body, Controller, Delete, Get, HttpStatus, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Role } from 'src/users/entities/roles.enum';
import { Roles } from 'src/utils/roles.decorator';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { Item } from '../entities/item.entity';
import { ItemsService } from '../services/items.service';

@Controller('items')
export class ItemsController {

  private readonly logger = new Logger(ItemsController.name);

  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAllItems( @Res() res ): Item[] {
    const items = this.itemsService.findAllItems();
    if (!items) throw new NotFoundException("La base de datos para Items no se encuentra"); 
    return res.status(HttpStatus.OK).json({ msg: "Items:", items });
  }

  @Get(":id")
  findItemByID( @Param("id") id: number ): Item[] {
    return this.itemsService.findItemByID(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  /* @UsePipes(new ValidationPipe({ whitelist: true })) */
  createItem( @Body() createItemDto: CreateItemDto,  @Res() res ): Item {
    const createdItem = this.itemsService.createItem(createItemDto);
    return res.status(HttpStatus.OK).json({ msg: "Item creado con éxito:", createdItem });
  }
  
  @Patch(":id")
  @UseGuards(LocalAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateItem( 
    @Param("id", ParseIntPipe) id: number, 
    @Body() updateItemDto: UpdateItemDto,  
    @Res() res ): Item[] {
    const editedItem = this.itemsService.updateItem(id, updateItemDto);   
    return res.status(HttpStatus.OK).json({ msg: "Item editado con éxito:", editedItem });    
  }

  @Put(":id")
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  replaceItem( 
    @Param("id", ParseIntPipe) id: number, 
    @Body() createItemDto: CreateItemDto,  
    @Res() res ): Item[] {
    const replacedItem = this.itemsService.replaceItem(id, createItemDto);
    return res.status(HttpStatus.OK).json({ msg: "Item actualizado o editado con éxito:", replacedItem }); 
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  removeItem( @Param("id", ParseIntPipe) id: number, @Res() res ): Item[] {
    const deletedItem= this.itemsService.removeItem(id);
    if (!deletedItem || deletedItem.length == 0) throw new NotFoundException("Este Item no existe");      
    return res.status(HttpStatus.OK).json({ msg: "El Item ya no se encuentra en la base de datos", deletedItem });
  }
}
