import 'reflect-metadata';

import { METADATA } from '../metadata';
import { ArrayType } from '../types';
import { ResourceExplorer } from './resource-explorer';

const emptyDecorator: PropertyDecorator = () => {
  void 0;
};

describe('ResourceExplorer', () => {
  class Region {
    constructor(public readonly id: string) {}
  }

  Reflect.defineMetadata(METADATA.RESOURCE.TYPE, 'region', Region.prototype);

  class Breed {
    constructor(
      public identifier: string,
      public name: string,
      public readonly region: Region,
    ) {}
  }

  Reflect.defineMetadata(
    METADATA.RESOURCE.RELATIONSHIPS,
    {
      region: { type: Region },
    },
    Breed.prototype,
  );

  class Paw {
    public readonly id: string;
    public readonly position: string;

    constructor(catId: number, position: string) {
      this.id = catId + '-' + position;
      this.position = position;
    }
  }

  Reflect.defineMetadata(
    METADATA.RESOURCE.ATTRIBUTES,
    {
      position: {},
    },
    Paw.prototype,
  );

  class Cat {
    constructor(id: number, nickname: string, age: number, breed: Breed) {
      this.id = id;
      this.nickname = nickname;
      this.age = age;
      this.breed = breed;
      this.createdAt = new Date();
      this.paws = [
        new Paw(id, 'LF'),
        new Paw(id, 'RF'),
        new Paw(id, 'LB'),
        new Paw(id, 'RB'),
      ]; // every cat has four paws
    }

    id: number;
    nickname: string;
    age: number;

    @emptyDecorator
    breed: Breed;

    @emptyDecorator
    paws: Paw[];

    createdAt: Date;
  }

  const catAttributes = {
    nickname: {},
    age: {},
  };

  const catPawsType = new ArrayType(Paw);

  Reflect.defineMetadata(
    METADATA.RESOURCE.ATTRIBUTES,
    catAttributes,
    Cat.prototype,
  );

  Reflect.defineMetadata(METADATA.RESOURCE.TYPE, 'cats', Cat.prototype);

  Reflect.defineMetadata(
    METADATA.RESOURCE.ID_KEY,
    'identifier',
    Breed.prototype,
  );

  Reflect.defineMetadata(
    METADATA.RESOURCE.RELATIONSHIPS,
    {
      breed: {},
      paws: {
        type: catPawsType,
      },
    },
    Cat.prototype,
  );

  xdescribe('exploreAttributes', () => {
    test('should obtain attributes definition', () => {
      const explorer = new ResourceExplorer(Cat);

      const attributeDefinitions = explorer.getAttributesDefinitions();

      expect(attributeDefinitions).toEqual(catAttributes);
    });

    test('should explore relationships definitions', () => {
      const explorer = new ResourceExplorer(Cat);

      const actualDefinitions = explorer.getRelationshipsDefinitions();

      expect(actualDefinitions.breed.type).toBe(Breed);
      expect(actualDefinitions.paws.type).toBe(catPawsType);
    });
  });
});
