"use strict";
// import { UUID } from "crypto";
// // import { Area, sequelize, User, UserArea } from "..";
// import { IArea } from "../../types/area.type";
// export const createArea = async (
//   area: IArea,
//   userId: string,
//   label: string,
// ) => {
//   try {
//     const result = await sequelize.transaction(async (t) => {
//       const newArea = await Area.create(area, { transaction: t });
//       const userArea = await UserArea.create(
//         {
//           UserId: userId as UUID,
//           AreaId: newArea.dataValues.id as number,
//           label: label,
//         },
//         { transaction: t },
//       );
//       return { area: newArea, userArea: userArea, status: "created" };
//     });
//     return result;
//   } catch (error) {
//     return error;
//   }
// };
// export const getAreaByUser = async (userId: UUID) => {
//   return await Area.findOne({
//     // where: { userId: userId },
//     // include: "UserAreas",
//     include: [
//       {
//         model: UserArea,
//         where: { userId: userId },
//       },
//     ],
//   });
// };
// export const createUserArea = async () => {
//   try {
//     const userArea = await UserArea.create({
//       UserId: "07716b5f-1b8a-4c1b-ae1a-55edfdefe22e",
//       // user_id: userId as UUID,
//       AreaId: 1,
//       // area_id: newArea.dataValues.id as number,
//       label: "Dhanmondi House",
//       // label: label,
//     });
//     return userArea;
//   } catch (error) {
//     console.log(error);
//   }
// };
// // export const createArea = async (area )
