import * as R from 'ramda';

export const mergeObjectSchemas = (a: any, b: any): any => {
  if (a.type !== 'object' || b.type !== 'object') {
    throw new TypeError();
  }
  return {
    type: 'object',
    properties: R.mergeLeft(b, a),
  };
};
