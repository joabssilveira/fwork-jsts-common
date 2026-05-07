// import { Where } from "./queryv2";

// type Primitive = string | number | boolean | Date | null | undefined;

// type IsRelation<T> =
//   NonNullable<T> extends Primitive ? false :
//   NonNullable<T> extends Array<any> ? true :
//   NonNullable<T> extends object ? true :
//   false;

// type RelationKeys<T> = {
//   [K in keyof T]: IsRelation<T[K]> extends true ? K : never
// }[keyof T];

// export type NestedQuery<T> = {
//   where?: Where<T>;
//   sort?: Partial<Record<keyof T, "asc" | "desc">>;
//   select?: (keyof T)[];
//   limit?: number;
//   skip?: number;
//   page?: number;
// };

// export type NestedNode<T> = {
//   [K in RelationKeys<T>]?: true | NestedConfig<T[K]>;
// };

// export type NestedConfig<T> = T extends (infer U)[]
//   ? {
//     query?: NestedQuery<U>;
//     nested?: NestedNode<U>;
//   }
//   : {
//     query?: NestedQuery<T>;
//     nested?: NestedNode<T>;
//   };


// export type Nested<T> = NestedNode<T>;

// ///////////////////////////////////////////////////////////////////////////

// export function buildNestedString<T>(nested: Nested<T>): string {
//   return Object.entries(nested)
//     .map(([key, value]) => serializeNode(key, value as any))
//     .join(",");
// }

// function serializeNode(name: string, config: true | NestedConfig<any>): string {
//   const nodeName = name; // mantém no padrão do model (courses_def, CoursesDef, etc)

//   if (config === true) {
//     return nodeName;
//   }

//   const parts: string[] = [];

//   // 1) query
//   if (config.query) {
//     parts.push(JSON.stringify(config.query));
//   }

//   // 2) children
//   if (config.nested) {
//     const childrenStr = Object.entries(config.nested)
//       .map(([childName, childConfig]) =>
//         serializeNode(childName, childConfig as any)
//       )
//       .join(",");

//     parts.push(childrenStr);
//   }

//   if (parts.length === 0) {
//     return nodeName;
//   }

//   return `${nodeName}{${parts.join(",")}}`;
// }

// ///////////////////////////////////////////////////////////////////////////

// export interface IApiClientParams<T> {
//   where?: Where<T>;
//   sort?: Partial<Record<keyof T, "asc" | "desc">>;
//   select?: (keyof T)[];
//   nested?: Nested<T>;
//   limit?: number;
//   skip?: number;
//   page?: number,
// }

// export function buildQueryParams<T>(params: IApiClientParams<T>) {
//   const query: Record<string, string> = {};

//   if (params.where) query.where = JSON.stringify(params.where);
//   if (params.sort) query.sort = JSON.stringify(params.sort);
//   if (params.select) query.select = JSON.stringify(params.select);
//   if (params.nested) query.nested = buildNestedString(params.nested);
//   if (params.limit != null) query.limit = String(params.limit);
//   if (params.skip != null) query.skip = String(params.skip);
//   if (params.page != null) query.page = String(params.page);

//   return query;
// }

// ///////////////////////////////////////////////////////////////////////////////

// /**
//  * example
//  */

// interface MyMaster {
//   id: number;
//   somefield: string;
//   myChildren: MyChild[];
// }

// interface MyChild {
//   id: number;
//   somefield: string;
//   myMasterId: number;
//   myMaster: MyMaster;

//   myChildrenLevel2: MyChildLevel2[],
// }

// interface MyChildLevel2 {
//   id: number,
//   somefield: string,
//   myChildAsMasterId: number,
//   myChildAsMaster: MyChild,
// }

// export const nestedMyMaster: Nested<MyMaster> = {
//   myChildren: {
//     nested: {
//       myChildrenLevel2: true,
//       // myChildrenLevel2: {
//       //   if there are more children at the next level
//       //   nested: {

//       //   },
//       //   filters the result set of the children (myChildrenLevel2)
//       //   query: {

//       //   }
//       // }
//     },
//     query: {
//       // filters the result set of the children (myChildren)
//       where: {
//         somefield: 'some value'
//       },
//       // only shows the children's IDs.
//       select: ['id'],
//       // sort the result set children
//       sort: { somefield: 'asc' },
//     }
//   }
// }

// export let nestedMyChild: Nested<MyChild> = {
//   myMaster: true
// }

// nestedMyChild = {
//   myMaster: {
//     // if you have another levels
//     nested: {

//     },
//   }
// }

// export const nestedMyChildLevel2: Nested<MyChildLevel2> = {
//   myChildAsMaster: {
//     nested: {
//       myMaster: {
//         nested: {
//           // some children
//         },
//         query: {
//           // some query
//         },
//       }
//     },
//     query: {
//       // some query
//     }
//   }
// }