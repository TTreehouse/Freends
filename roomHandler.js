"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBestDays = exports.createUserId = exports.createRoomId = void 0;
const uuid_1 = require("uuid");
let createRoomId = () => {
    return uuid_1.v4();
};
exports.createRoomId = createRoomId;
let createUserId = () => {
    return uuid_1.v4();
};
exports.createUserId = createUserId;
let calculateBestDays = (room) => {
    let dayInfo = [];
    for (let i = 0; i < 14; i++) {
        dayInfo[i] = { day: i, users: [], userCount: 0 };
    }
    room.users.forEach((user) => {
        user.availableDays.forEach((day) => {
            dayInfo[day].userCount++;
            dayInfo[day].users.push(user.name);
        });
    });
    room.bestDays = dayInfo;
};
exports.calculateBestDays = calculateBestDays;
//# sourceMappingURL=roomHandler.js.map