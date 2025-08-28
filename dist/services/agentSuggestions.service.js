"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentSuggestions = void 0;
const mongoose_1 = require("mongoose");
// import Schedule from "../db/models/schedule.model";
const agent_model_1 = __importDefault(require("../db/models/agent.model"));
const agentSuggestions = (appointmentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agents = yield getAgentsSortedByInterest(appointmentId);
        return agents;
    }
    catch (error) {
        console.log(error);
        return "db error";
    }
});
exports.agentSuggestions = agentSuggestions;
// const getAgentsBySchedule = async (day: string, timeslots: string[]) => {
//   try {
//     const agents = await Schedule.aggregate([
//       {
//         $match: {
//           day: day,
//           timeslot: { $in: timeslots },
//         },
//       },
//       {
//         $lookup: {
//           from: "agents",
//           localField: "agent",
//           foreignField: "_id",
//           as: "agent",
//         },
//       },
//       {
//         $unwind: "$agent",
//       },
//       {
//         $lookup: {
//           from: "zones",
//           localField: "agent.zone",
//           foreignField: "_id",
//           as: "agent.zone",
//         },
//       },
//       {
//         $unwind: {
//           path: "$agent.zone",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $group: {
//           _id: "$agent._id",
//           name: { $first: "$agent.name" }, // first returns the first value it sees
//           phone: { $first: "$agent.phone" },
//           zone: { $first: "$agent.zone" },
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           name: 1,
//           phone: 1,
//           zone: 1,
//         },
//       },
//     ]);
//     return agents;
//   } catch (error) {
//     console.log(error);
//     return "db error";
//   }
// };
const getAgentsSortedByInterest = (appointmentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agents = yield agent_model_1.default.aggregate([
            {
                $lookup: {
                    from: "zones",
                    localField: "zone",
                    foreignField: "_id",
                    as: "zone",
                },
            },
            {
                $unwind: {
                    path: "$zone",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "interests",
                    let: { userId: "$user" }, // NOTE: match interests.agent to this
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$agent", { $toObjectId: "$$userId" }] },
                                        {
                                            $eq: ["$appointment", new mongoose_1.Types.ObjectId(appointmentId)],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "interests",
                },
            },
            {
                $addFields: {
                    hasInterest: { $gt: [{ $size: "$interests" }, 0] },
                },
            },
            {
                $sort: { hasInterest: -1 },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    phone: 1,
                    profile_picture: 1,
                    nid: 1,
                    dob: 1,
                    gender: 1,
                    zone: 1,
                    user: 1,
                    hasInterest: 1,
                },
            },
        ]);
        return agents;
    }
    catch (error) {
        console.log(error);
        return "db error";
    }
});
