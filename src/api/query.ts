type Unpacked<T> = T extends (infer U)[] ?
    U :
    T extends ReadonlyArray<infer U> ? U : T;

type AnyArray<T> = T[] | ReadonlyArray<T>;

type LogicalOp<T> = {
  $and?: Array<Where<T>>;
  $or?: Array<Where<T>>;
  [key: string]: any;
};

type ComparisonOp<T> = {
  $eq?: T;
  $gt?: T;
  $gte?: T;
  $in?: [T] extends AnyArray<any> ? Unpacked<T>[] : T[];
  $lt?: T;
  $lte?: T;
  $ne?: T;
  $nin?: [T] extends AnyArray<any> ? Unpacked<T>[] : T[];
  $not?: T extends string ? ComparisonOp<T> | RegExp : ComparisonOp<T>;
  $exists?: boolean;
  $regex?: T extends string ? RegExp | string : never;
};

type ApplyBasicQueryCasting<T> = T | T[] | (T extends (infer U)[] ? U : any) | any;
type Condition<T> = ApplyBasicQueryCasting<T> | ComparisonOp<ApplyBasicQueryCasting<T>>;

type _Where<T> = {
  [P in keyof T]?: Condition<T[P]>;
} & LogicalOp<T>;

export type Where<T> = _Where<T>;