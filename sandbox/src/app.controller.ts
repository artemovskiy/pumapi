import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { Shop, ShopDocument } from './domain/shop.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {ArrayType, Description, JsonapiInterceptor, ResponseResource, Summary} from 'nest-json-api';
import { ShopResource, GoodsItemResource } from './shop.resource';

@Controller()
@UseInterceptors(JsonapiInterceptor)
export class AppController {
  constructor(
    @InjectModel(Shop.name) private shopDocumentModel: Model<ShopDocument>,
  ) {}

  @Get('/shops')
  @Description('Retrieves all available shops')
  @Summary('Retrieves all available shops')
  @ResponseResource({
    type: new ArrayType(ShopResource),
  })
  async getShops() {
    const shops = await this.shopDocumentModel.find();
    return shops;
  }

  @Get('/shops/:id/goods')
  @ResponseResource({
    type: new ArrayType(GoodsItemResource),
  })
  async getGoods(@Param('id') shopId: string) {
    const shop = await this.shopDocumentModel.findOne({
      id: shopId,
    });
    return shop.goods;
  }
}
