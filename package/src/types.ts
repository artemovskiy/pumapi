import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';

export type Constructor<T, TArgs extends any[] = any[]> = {
  new (...args: TArgs): T;
};

export type ARelationshipDefinition<T> = {
  type?: Constructor<T>;
};

export type RelationshipDefinitions<T> = {
  [P in keyof T]?: ARelationshipDefinition<T[P]>;
};

export class ArrayType<T extends Constructor<any>> {
  constructor(public readonly ctor: T) {}

  get name() {
    return `${this.ctor.name}Array`;
  }
}

export type DocumentResponse<T> = {
  type: T extends Array<infer I> ? ArrayType<Constructor<I>> : Constructor<T>;
};

// Client Generated Identifier
export type CGIOption = 'require' | 'allow' | 'deny';

export type InputResourceOptions = {
  cgi: CGIOption; // deny by default
};

export type AttributeInputOption = 'required' | 'optional' | 'disabled';

export type AttributeOptions = {
  input: AttributeInputOption;
  type: Constructor<any> | ArrayType<Constructor<any>>;
};

export type ParameterDefinition = {
  name: string;
  location: RouteParamtypes;
  type: Constructor<any> | ArrayType<Constructor<any>>;
};
