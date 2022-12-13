import { Attribute, Relationship, Resource } from 'pumapi';
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
