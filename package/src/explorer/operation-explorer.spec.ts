import {
  Body, Controller, Param, Post, RequestMethod,
} from '@nestjs/common';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import { Attribute, Resource, ResponseResource } from '../decorators';
import { OperationExplorer } from './operation-explorer';

describe('OperationExplorer', () => {
  @Resource({
    type: 'breed',
  })
  class Breed {
    @Attribute()
    name: string;
  }
  @Controller('/cat')
  class CatController {
    @Post(':catId/breed')
    @ResponseResource({
      type: Breed,
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setCatBreed(@Body() breed: Breed, @Param('catId') catId: string) {
      return {
        name: 'angora',
      };
    }
  }

  let explorer: OperationExplorer<'setCatBreed', CatController>;

  beforeEach(() => {
    explorer = new OperationExplorer(CatController, 'setCatBreed', '/cat');
  });

  test('should explore operation http method', () => {
    expect(explorer.exploreMethod()).toBe(RequestMethod.POST);
  });

  test('should explore operation path', () => {
    expect(explorer.explorePath()).toBe('/cat/:catId/breed');
  });

  test('should explore operation params', () => {
    expect(explorer.exploreParams()).toEqual([
      {
        location: RouteParamtypes.PARAM,
        name: 'catId',
        type: String,
      },
      {
        location: RouteParamtypes.BODY,
        name: 'undefined',
        type: Breed,
      },
    ]);
  });

  test('should explore response resource', () => {
    expect(explorer.exploreResponseResource()).toEqual({ type: Breed });
  });
});
