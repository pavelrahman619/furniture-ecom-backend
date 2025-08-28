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
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignPatientDetailsMiddleware = void 0;
const user_query_1 = require("../db/queries/user.query");
const assignPatientDetailsMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.for_someone) {
            const details = yield (0, user_query_1.getUserPropertiesByID)(req.body.user_id, "first_name last_name sex date_of_birth");
            req.body.patient_details = {
                name: `${details === null || details === void 0 ? void 0 : details.first_name} ${details === null || details === void 0 ? void 0 : details.last_name}`,
                gender: details === null || details === void 0 ? void 0 : details.sex,
            };
            next();
        }
        else {
            next();
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.assignPatientDetailsMiddleware = assignPatientDetailsMiddleware;
