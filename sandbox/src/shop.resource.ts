import { ArrayType, Attribute, Relationship, Resource } from 'nest-json-api';

@Resource({
  type: 'user',
})
export class UserResource {
  @Attribute()
  name: string;
}

@Resource({
  type: 'goods',
})
export class GoodsItemResource {
  @Attribute()
  name: string;
  @Attribute()
  price: number;
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
    type: new ArrayType(GoodsItemResource),
  })
  goods: GoodsItemResource[];
}
