import { Command, CommandRunner, Option } from 'nest-commander';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GoodsItem, Shop, ShopDocument, User } from '../domain/shop.schema';
import { faker } from '@faker-js/faker';
import * as R from 'ramda';

@Command({ name: 'seed-shops', description: 'A parameter parse' })
export class SeedShopsCommand implements CommandRunner {
  constructor(
    @InjectModel(Shop.name) private shopDocumentModel: Model<ShopDocument>,
  ) {}

  async run(
    passedParam: string[],
    options?: Record<string, never>,
  ): Promise<void> {
    const owner = new User();
    owner.id = faker.datatype.uuid();
    owner.name = faker.name.findName();
    const shop = new this.shopDocumentModel({
      name: faker.company.companyName(),
      owner,
      goods: this.getGoods(),
    });
    await shop.save();
  }

  private getGoods(): GoodsItem[] {
    return R.range(0, 7).map(() => {
      const item = new GoodsItem();
      item.id = faker.datatype.uuid();
      item.name = faker.commerce.productName();
      item.price = faker.datatype.float({ min: 10, max: 500 });
      return item;
    });
  }

  @Option({
    flags: '-n, --number [number]',
    description: 'A basic number parser',
  })
  parseNumber(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '-s, --string [string]',
    description: 'A string return',
  })
  parseString(val: string): string {
    return val;
  }

  @Option({
    flags: '-b, --boolean [boolean]',
    description: 'A boolean parser',
  })
  parseBoolean(val: string): boolean {
    return JSON.parse(val);
  }
}
