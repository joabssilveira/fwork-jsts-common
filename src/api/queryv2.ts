// export type ComparisonOperators<T> = {
//   $eq?: T;
//   $ne?: T;

//   $gt?: T;
//   $gte?: T;

//   $lt?: T;
//   $lte?: T;

//   $in?: T extends (infer U)[] ? U[] : T[];
//   $nin?: T extends (infer U)[] ? U[] : T[];

//   $like?: T extends string ? string : never;
//   $ilike?: T extends string ? string : never;

//   $between?: [T, T];

//   $exists?: boolean;
//   $null?: boolean;
// };

// export type FieldCondition<T> =
//   | T
//   | ComparisonOperators<T>;

// export type LogicalOperators<T> = {
//   $and?: Where<T>[];
//   $or?: Where<T>[];
//   $not?: Where<T>;
//   [key: string]: any;
// };

// export type Where<T> = {
//   [P in keyof T]?: FieldCondition<T[P]>;
// } & LogicalOperators<T>;

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

// const filterEq: Where<MyMaster> = {
//   somefield: {
//     $eq: 'some value'
//   }
// }

// const filterEqSimplified: Where<MyMaster> = {
//   somefield: 'some value'
// }

// const filterNe: Where<MyMaster> = {
//   somefield: {
//     $ne: 'some value'
//   }
// }

// const filterGt: Where<MyMaster> = {
//   id: {
//     $gt: 10
//     // its the same way for lt
//   }
// }

// const filterGte: Where<MyMaster> = {
//   id: {
//     $gte: 10
//     // its the same way for lte
//   }
// }

// const filterIn: Where<MyMaster> = {
//   id: {
//     $in: [1, 10]
//     // its the same way for nin
//   }
// }

// const filterLike: Where<MyMaster> = {
//   somefield: {
//     $like: 'some value'
//     // its the same way for ilike
//   }
// }

// const filterExists: Where<MyMaster> = {
//   id: {
//     $exists: true
//   }
// }

// const filterIsNotNull: Where<MyMaster> = {
//   somefield: {
//     $null: false
//   }
// }

// const filterAnd: Where<MyMaster> = {
//   $and: [{
//     id: 10
//   }, {
//     somefield: 'some value'
//   }]
// }

// const filterAndII: Where<MyMaster> = {
//   $and: [{
//     id: {
//       $eq: 10
//     }
//   }, {
//     somefield: {
//       $eq: 'some value'
//     }
//   }]
// }

// const filterAndSimplified: Where<MyMaster> = {
//   id: 10,
//   somefield: 'some value'
// }

// const filterAndIII: Where<MyMaster> = {
//   id: {
//     $eq: 10
//   },
//   somefield: {
//     $eq: 'some value'
//   }
// }

// const filterOr: Where<MyMaster> = {
//   $or: [{
//     id: 10
//   }, {
//     somefield: 'some value'
//   }]
// }

// const filterNot: Where<MyMaster> = {
//   $not: {
//     id: 10
//   }
// }

// const filterByChildren: Where<MyMaster> = {
//   // There's no Intellisense here.
//   'myChildren.somefield': {
//     // There's no Intellisense here.
//     $eq: 'some value'
//   }
// }

// const filterByChildrenLevelN: Where<MyMaster> = {
//   // There's no Intellisense here.
//   'myChildren.myChildrenLevel2.somefield': {
//     // There's no Intellisense here.
//     $eq: 'some value'
//   }
// }