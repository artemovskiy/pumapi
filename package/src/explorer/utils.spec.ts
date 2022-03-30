import {
  assertOnlyOpeningExceptTrailingSlash,
  assertOnlyOpeningSlash,
} from './utils';

describe('scanner utils', () => {
  describe('assertOnlyOpeningSlash', () => {
    test.each([
      ['', '/'],
      ['/', '/'],
      ['/foo', '/foo'],
      ['foo/', '/foo'],
      ['/foo/', '/foo'],
      ['/foo/bar/', '/foo/bar'],
      ['foo/bar/', '/foo/bar'],
      ['/foo/bar', '/foo/bar'],
      ['/foo/bar/', '/foo/bar'],
    ])('should transform %s into %s', (input, expected) => {
      expect(assertOnlyOpeningSlash(input)).toBe(expected);
    });
  });
  describe('assertOnlyOpeningExceptTrailingSlash', () => {
    test.each([
      ['', ''],
      ['/', ''],
      ['/foo', '/foo'],
      ['foo/', '/foo'],
      ['/foo/', '/foo'],
      ['/foo/bar/', '/foo/bar'],
      ['foo/bar/', '/foo/bar'],
      ['/foo/bar', '/foo/bar'],
      ['/foo/bar/', '/foo/bar'],
    ])('should transform %s into %s', (input, expected) => {
      expect(assertOnlyOpeningExceptTrailingSlash(input)).toBe(expected);
    });
  });
});
