import { Injectable } from '@nestjs/common';
import { CreateLineItemDto } from './dto/create-line-item.dto';
import { UpdateLineItemDto } from './dto/update-line-item.dto';

@Injectable()
export class LineItemsService {
  create(createLineItemDto: CreateLineItemDto) {
    return 'This action adds a new lineItem';
  }

  findAll() {
    return `This action returns all lineItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lineItem`;
  }

  update(id: number, updateLineItemDto: UpdateLineItemDto) {
    return `This action updates a #${id} lineItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} lineItem`;
  }
}
