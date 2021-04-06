"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const db_1 = require("../../db");
const roomHandler_1 = require("../../roomHandler");
const router = express.Router();
module.exports = router;
router.post("/", async (req, res) => {
    try {
        if ("id" in req.body) {
            const room = await db_1.Room.findOne({ roomId: req.body.id });
            if (room != null && room != undefined) {
                return res.json(room).end();
            }
            else {
                return res.status(400).send("BAD REQUEST: Room not found").end();
            }
        }
        else {
            return res.status(400).send("BAD REQUEST: Id not sent").end();
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("INTERNAL SERVER ERROR").end();
    }
});
router.post("/createRoom", (req, res) => {
    try {
        if ("name" in req.body) {
            const room = new db_1.Room();
            // Checks if name is only whitespace
            let name = req.body.name;
            if (name.length > 20) {
                return res
                    .status(400)
                    .send("BAD REQUEST: Room name cannot be longer than 20 characters")
                    .end();
            }
            if (name.length === 0 || !name.trim()) {
                return res
                    .status(400)
                    .send("BAD REQUEST: Room name cannot be blank")
                    .end();
            }
            room.roomName = name;
            room.roomId = roomHandler_1.createRoomId();
            const date = new Date();
            room.startDate = Math.floor(date.getTime());
            room.ISODate = date.toISOString();
            room.save();
            return res.status(201).json(room).end();
        }
        return res.status(400).send("BAD REQUEST: Missing room name").end();
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("INTERNAL SERVER ERROR").end();
    }
});
router.post("/addUser", async (req, res) => {
    try {
        if ("user" in req.body) {
            if ("id" in req.body) {
                const room = await db_1.Room.findOne({ roomId: req.body.id });
                if (room != null && room != undefined) {
                    if (room.users.length >= 30) {
                        return res
                            .status(400)
                            .send("BAD REQUEST: User count for room exceeded maximum")
                            .end();
                    }
                    let user = req.body.user;
                    if (!(typeof user == "object")) {
                        return res
                            .status(400)
                            .send("BAD REQUEST: User should be an object")
                            .end();
                    }
                    if (!("name" in user) || !("availableDays" in user)) {
                        return res
                            .status(400)
                            .send("BAD REQUEST: User information missing")
                            .end();
                    }
                    if (typeof user.name != "string" ||
                        !Array.isArray(user.availableDays)) {
                        return res
                            .status(400)
                            .send("BAD REQUEST: User information not in correct form")
                            .end();
                    }
                    let uniqueDays = [...new Set(user.availableDays)];
                    if (uniqueDays.length > 14) {
                        return res
                            .status(400)
                            .send("BAD REQUEST: User information missing")
                            .end();
                    }
                    uniqueDays.forEach((element) => {
                        if (typeof element != "number" || element < 0 || element > 13) {
                            return res
                                .status(400)
                                .send("BAD REQUEST: User days are NaN or exceed the acceptable bounds (0-13)")
                                .end();
                        }
                    });
                    let userIdFound = false;
                    if ("userId" in user) {
                        for (let i of room.users) {
                            if (i.userId == user.userId) {
                                room.users.splice(room.users.indexOf(i), 1);
                                userIdFound = true;
                                break;
                            }
                        }
                    }
                    if (userIdFound == false) {
                        user.userId = roomHandler_1.createUserId();
                    }
                    user = {
                        name: user.name,
                        userId: user.userId,
                        availableDays: uniqueDays,
                    };
                    room.users.push(user);
                    roomHandler_1.calculateBestDays(room);
                    room.save();
                    return res.json(room).end();
                }
                else {
                    return res.status(400).send("BAD REQUEST: Room not found").end();
                }
            }
            else {
                return res.status(400).send("BAD REQUEST: Room id missing").end();
            }
        }
        else {
            return res.status(400).send("BAD REQUEST: User info missing").end();
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("INTERNAL SERVER ERROR").end();
    }
});
//# sourceMappingURL=rooms.js.map