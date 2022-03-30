import { Attribute, Resource } from './decorators';
import { DocumentSerializer } from './serializer';
import {
  ResourceDeserializer,
  StubRelationshipsResolver,
} from './deserializer';
import { ResourceExplorer } from './explorer';
import {
  LinksRelationshipSchemaGenerator,
  ResourceSchemaGenerator,
} from './schema-generator';

@Resource({
  type: 'cat',
})
class Cat {
  id: number;
  @Attribute()
  nickname: string;
}

xdescribe('plugin spec', () => {
  describe('serialization', () => {
    test('should serialize cat', () => {
      const documentSerializer = new DocumentSerializer(
        Cat,
        'http://localhost:300',
      );

      const object = {
        id: 3,
        nickname: 'Barsik',
      };
      const actualDocument = documentSerializer.serialize(object);

      const expectedDocument = {
        data: {
          id: 3,
          type: 'cat',
          attributes: {
            nickname: 'Barsik',
          },
        },
      };
      expect(actualDocument).toEqual(expectedDocument);
    });
  });
  describe('deserialization', () => {
    test('should deserialize cat resource', async () => {
      const catExplorer = new ResourceExplorer(Cat);
      const resourceDeserializer = new ResourceDeserializer(
        {
          id: '3',
          type: 'cat',
          attributes: {
            nickname: 'Barsik',
          },
        },
        catExplorer,
        'allow',
        new StubRelationshipsResolver(),
      );

      const actual = await resourceDeserializer.deserialize();
      expect(actual).toEqual({
        id: 3,
        nickname: 'Barsik',
      });
    });
  });

  describe('schema generation', () => {
    test('should generate resource schema', () => {
      const schemaGenerator = new ResourceSchemaGenerator(
        new ResourceExplorer(Cat),
        new LinksRelationshipSchemaGenerator(),
      );

      const schema = schemaGenerator.buildResourceSchema();

      expect(schema).toBe({
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['cat'] },
          attributes: {
            type: 'object',
            properties: {
              nickname: { type: 'string' },
            },
          },
        },
      });
    });
  });
});
