import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Shop, ShopDocument } from './domain/shop.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ArrayType,
  Description,
  InputResource,
  JsonapiInterceptor,
  ResponseResource,
  Summary,
  Response,
} from 'nest-json-api';
import { ShopResource } from './shop.resource';
import { GoodsItemResource } from './goods-item.resource';
import { Tag } from 'pumapi';

@Controller()
@UseInterceptors(JsonapiInterceptor)
export class AppController {
  constructor(
    @InjectModel(Shop.name) private shopDocumentModel: Model<ShopDocument>,
  ) {}

  @Get('/shops')
  @Tag('shop')
  @Description('Retrieves all available shops')
  @Summary('Retrieves all available shops')
  @ResponseResource({
    type: new ArrayType(ShopResource),
  })
  async getShops() {
    const shops = await this.shopDocumentModel.find();
    return new Response([new Shop(), new Shop()], {count: 228});
  }

  @Get('/shops/:id/goods')
  @Tag('shop')
  @ResponseResource({
    type: new ArrayType(GoodsItemResource),
  })
  async getGoods(@Param('id') shopId: string) {
    const shop = await this.shopDocumentModel.findOne({
      id: shopId,
    });
    return shop.goods;
  }

  @Post('goods')
  @Tag('goods')
  @InputResource({ cgi: 'deny' })
  async createGoodsItem(@Body() body: GoodsItemResource) {}
}
