import * as R from 'ramda';

export const assertOnlyOpeningSlash = R.pipe<[string], string, string>(
  R.when(
    (str) => !str.length || str[0] !== '/',
    (str) => `/${str}`,
  ),
  R.when(
    (str) => str.length > 1 && str[str.length - 1] === '/',
    (str) => str.slice(0, str.length - 1),
  ),
);

export const assertOnlyOpeningExceptTrailingSlash = R.pipe<
[string],
string,
string
>(
  R.when(
    (str) => str.length && str[0] !== '/',
    (str) => `/${str}`,
  ),
  R.when(
    (str) => str.length && str[str.length - 1] === '/',
    (str) => str.slice(0, str.length - 1),
  ),
);
