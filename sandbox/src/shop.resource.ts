import { ArrayType, Attribute, Relationship, Resource } from 'pumapi';
import { GoodsItemResource } from './goods-item.resource';

@Resource({
  type: 'user',
})
export class UserResource {
  @Attribute()
  name: string;
}

@Resource({
  type: 'shop',
})
export class ShopResource {
  @Attribute()
  name: string;
  @Relationship()
  owner: UserResource;
  @Relationship({
    type: () => new ArrayType(GoodsItemResource),
  })
  goods: GoodsItemResource[];
}
