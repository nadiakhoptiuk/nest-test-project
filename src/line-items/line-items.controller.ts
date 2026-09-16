import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LineItemsService } from './line-items.service';
import { CreateLineItemDto } from './dto/create-line-item.dto';
import { UpdateLineItemDto } from './dto/update-line-item.dto';

@Controller('line-items')
export class LineItemsController {
  constructor(private readonly lineItemsService: LineItemsService) {}

  @Post()
  create(@Body() createLineItemDto: CreateLineItemDto) {
    return this.lineItemsService.create(createLineItemDto);
  }

  @Get()
  findAll() {
    return this.lineItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lineItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLineItemDto: UpdateLineItemDto) {
    return this.lineItemsService.update(+id, updateLineItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lineItemsService.remove(+id);
  }
}
