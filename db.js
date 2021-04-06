"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = exports.MongoSetup = void 0;
const mongoose = require("mongoose");
let Room;
exports.Room = Room;
let MongoSetup = () => {
    mongoose.connect("mongodb+srv://application:dvWGxZrac1uA8d41@freends.l5l9r.mongodb.net/freends?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", async () => {
        // Connection achieved.
        let roomSchema = new mongoose.Schema({
            roomId: String,
            roomName: String,
            startDate: Number,
            ISODate: String,
            bestDays: {
                type: [{ day: Number, users: { type: [String] }, userCount: Number }],
            },
            users: {
                type: [
                    { name: String, userId: String, availableDays: { type: [Number] } },
                ],
            },
        });
        // the name of the model is the same as the singular version of the name of the collection
        // the posts save to. for example post => posts, bus => buses
        exports.Room = Room = mongoose.model("Room", roomSchema);
    });
};
exports.MongoSetup = MongoSetup;
//# sourceMappingURL=db.js.map