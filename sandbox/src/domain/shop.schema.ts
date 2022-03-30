import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShopDocument = Shop & Document;

export class User {
  id: string;
  name: string;
}

export class GoodsItem {
  id: string;
  name: string;
  price: number;
}

@Schema()
export class Shop {
  @Prop()
  name: string;

  @Prop(User)
  owner: User;

  @Prop([GoodsItem])
  goods: GoodsItem;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
