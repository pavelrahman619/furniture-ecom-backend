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
exports.removeNotification = exports.getNotificationsCount = exports.getNotifications = exports.setNotification = void 0;
const index_1 = require("../redis/index");
const setNotification = (userId, notificationBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield index_1.redis.lpush(`notification : ${userId}`, JSON.stringify(notificationBody));
        console.log(res);
    }
    catch (error) {
        console.log(error);
    }
});
exports.setNotification = setNotification;
const getNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield index_1.redis.lrange(`notification : ${userId}`, 0, -1);
        return notifications;
    }
    catch (error) {
        console.log(error);
    }
});
exports.getNotifications = getNotifications;
const getNotificationsCount = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield index_1.redis.llen(`notification : ${userId}`);
        return count;
    }
    catch (error) {
        console.log(error);
    }
});
exports.getNotificationsCount = getNotificationsCount;
const removeNotification = (userId, notification_to_remove) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(notification_to_remove);
    try {
        const count = yield index_1.redis.lrem(`notification : ${userId}`, 0, notification_to_remove);
        return count;
    }
    catch (error) {
        console.log(error);
    }
});
exports.removeNotification = removeNotification;
