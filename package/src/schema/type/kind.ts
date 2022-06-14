export enum TypeKind {
  Class = 1,
  /**
   * Some subtype of string, number, boolean
   * @example <caption>type Foo = "hello world" | "hello"</caption>
   * String "hello world" is literal type and it is subtype of string.
   *
   * <caption>type TheOnlyTrue = true;</caption>
   * Same as true is literal type and it is subtype of boolean.
   */
  LiteralType = 6,
  Enum = 13,
  Array = 14,
}
