import 'reflect-metadata';
import * as JSONAPI from 'jsonapi-typescript';

import { Relationship } from '../decorators';
import { ResourceSerializer } from './resource-serializer';
import { ArrayType } from '../types';
import { RelationshipLinksSerializer } from './relationship-links-serializer';
import { METADATA } from '../metadata';
import { ResourceExplorer } from '../explorer';
import Mocked = jest.Mocked;
import {
  RelationshipSerializer,
  ResourceRelationshipExtended,
} from './relationship-serializer.interface';

const MockerResourceExplorer = (
  jest.createMockFromModule('../explorer') as {
    ResourceExplorer: jest.MockedClass<typeof ResourceExplorer>;
  }
).ResourceExplorer;

class StubRelationshipSerializer implements RelationshipSerializer {
  serialize<T, R extends keyof T>(
    relationship: ResourceRelationshipExtended<T, R>,
  ): JSONAPI.RelationshipObject {
    return undefined;
  }
}

describe('ResourceSerializer', () => {
  type Dog = {
    identifier: string;
  };

  type Cat = {
    id: number;
    nickname: string;
    age: number;
  };

  const cats: Cat[] = [
    {
      id: 105,
      nickname: 'Barsik',
      age: 3,
    },
  ];

  let catExplorer: jest.Mocked<ResourceExplorer<Cat>>;
  let dogExplorer: jest.Mocked<ResourceExplorer<Dog>>;

  beforeEach(() => {
    catExplorer = new MockerResourceExplorer(null) as unknown as jest.Mocked<
      ResourceExplorer<any>
    >;
    catExplorer.getIdKey.mockReturnValue('id');
    catExplorer.getType.mockReturnValue('cat');
    catExplorer.getAttributesDefinitions.mockReturnValue({
      nickname: {
        input: 'required',
        type: String,
      },
      age: {
        input: 'optional',
        type: Number,
      },
    });

    dogExplorer = new MockerResourceExplorer(null) as unknown as jest.Mocked<
      ResourceExplorer<Dog>
    >;
    dogExplorer.getIdKey.mockReturnValue('identifier');
    dogExplorer.getType.mockReturnValue('dog');
    dogExplorer.getAttributesDefinitions.mockReturnValue({});
  });

  xit('should serialize resource identification', () => {
    const serializer = new ResourceSerializer(catExplorer);

    const result = serializer.serialize(
      cats[0],
      new StubRelationshipSerializer(),
    );

    expect(result.id).toBe(105);
    expect(result.type).toBe('cat');
  });

  it('should serialize resource identification with custom id key', () => {
    const serializer = new ResourceSerializer(dogExplorer);

    const result = serializer.serialize(
      { identifier: '111-rex' },
      new StubRelationshipSerializer(),
    );

    expect(result.id).toBe('111-rex');
    expect(result.type).toBe('dog');
  });

  /*const angoraBreed = new Breed(
      'breed-angora',
      'Angora',
      new Region('Turkey'),
    );
    const cats = [new Cat(13, 'barsik', 3, angoraBreed)];

    test('should serialize fields with @Attribute decorator', () => {
      const resource = new ResourceSerializer(Cat).serialize(
        cats[0],
        new RelationshipLinksSerializer('http://test.io/'),
      );
      expect(resource.attributes).toEqual({
        nickname: 'barsik',
        age: 3,
      });
    });

    test('should serialize plain object as well', () => {
      const resource = new ResourceSerializer(Cat).serialize(
        {
          id: 1,
          nickname: 'barsik',
          age: 3,
          createdAt: new Date(),
          breed: null,
          paws: [],
        },
        new RelationshipLinksSerializer('http://test.io/'),
      );
      expect(resource.attributes).toEqual({
        nickname: 'barsik',
        age: 3,
      });
    });

    test("should set resource id by default from 'id' property", () => {
      const resource = new ResourceSerializer(Cat).serialize(
        cats[0],
        new RelationshipLinksSerializer('http://test.io/'),
      );
      expect(resource.id).toBe(13);
    });

    test('should set resource id by specified key', () => {
      const resource = new ResourceSerializer(Breed).serialize(
        new Breed('breed/persian', 'persian', new Region('iran')),
        new RelationshipLinksSerializer('http://test.io/'),
      );
      expect(resource.id).toBe('breed/persian');
    });

    test('should set resource type by class name by default', () => {
      const resource = new ResourceSerializer(Breed).serialize(
        new Breed('breed/persian', 'persian', new Region('iran')),
        new RelationshipLinksSerializer('http://test.io/'),
      );
      expect(resource.type).toBe(Breed.name);
    });

    test('should set resource type by metadata if presented', () => {
      const resource = new ResourceSerializer(Cat).serialize(
        cats[0],
        new RelationshipLinksSerializer('http://test.io/'),
      );
      expect(resource.type).toBe('cats');
    });

    test('should serialize cat`s breed', () => {
      const relationshipsSerializer = new RelationshipLinksSerializer(
        'http://test.io/',
      );
      const serializeSpy = jest.spyOn(relationshipsSerializer, 'serialize');

      const resource = new ResourceSerializer(Cat).serialize(
        cats[0],
        relationshipsSerializer,
      );

      expect(serializeSpy).toBeCalledTimes(2);

      const breedRelationship = serializeSpy.mock.calls[0][0];
      expect(breedRelationship.object).toBe(cats[0]);
      expect(breedRelationship.oCtor).toBe(Cat);
      expect(breedRelationship.key).toBe('breed');
      expect(breedRelationship.rCtor).toBe(Breed);
      expect(breedRelationship.related).toBe(angoraBreed);

      const pawsRelationship = serializeSpy.mock.calls[1][0];
      expect(pawsRelationship.object).toBe(cats[0]);
      expect(pawsRelationship.oCtor).toBe(Cat);
      expect(pawsRelationship.key).toBe('paws');
      expect(pawsRelationship.rCtor).toBe(pawsArrayType);
      expect(pawsRelationship.related).toBe(cats[0].paws);
    });
  });*/
});
