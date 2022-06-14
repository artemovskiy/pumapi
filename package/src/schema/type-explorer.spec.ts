import { TypeExplorer } from './type-explorer';
import { MetadataStorage } from './metadata-storage';
import { Property } from './class/object';
import 'reflect-metadata';
import { ClassType } from './class/class-type';
import { TypeKind } from './type/kind';

describe('TypeExplorer', () => {
  test('should detect simple class type', () => {
    const typeExplorer = new TypeExplorer(
      MetadataStorage.instance(),
    );

    class State {
      @Property()
      name: string;

      @Property()
      code: string;
    }

    class Address {
      @Property()
      state: State;

      @Property()
      city: string;

      @Property()
      street: string;

      @Property()
      house: number;

      @Property({ optional: true })
      apartment: number;
    }

    class User {
      @Property()
      name: string;

      @Property()
      address: Address;
    }

    class Merchant {
      @Property()
      id: number;

      @Property()
      address: Address;
    }

    const type = typeExplorer.getClassType(Address);

    console.log(type.getProperties());
    console.log((type.getProperties().find(({ name }) => name === 'state').type.as(TypeKind.Class)).getProperties());

    const userType: ClassType = typeExplorer.getClassType(User);
    const merchantType: ClassType = typeExplorer.getClassType(Merchant);

    const userAdressType: ClassType = userType.getProperty('address').type.as(TypeKind.Class);
    const merchantAdressType: ClassType = merchantType.getProperty('address').type.as(TypeKind.Class);
    expect(userAdressType.getConstructorReference()).toBe(merchantAdressType.getConstructorReference());
  });
});
