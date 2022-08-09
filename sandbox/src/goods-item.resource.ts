import { Attribute, Relationship, Resource } from 'nest-json-api';
import { ShopResource } from './shop.resource';

@Resource({
  type: 'goods',
})
export class GoodsItemResource {
  @Attribute()
  name: string;
  @Attribute()
  price: number;
  @Relationship({ type: () => ShopResource })
  shop: ShopResource;
}
