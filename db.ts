import mongoose = require("mongoose");
import { v4 as uuidv4 } from "uuid";

let Room: mongoose.Model<IRoom>;

interface IRoom extends mongoose.Document {
	roomId: string;
	roomName: string;
	startDate: number;
	bestDays: { day: number; users: string[]; userCount: number }[];
	users: { name: string; userId: string; availableDays: number[] }[];
}

export { MongoSetup, Room, IRoom };

let MongoSetup = () => {
	mongoose.connect("mongodb://localhost:27017/freends", {
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
		Room = mongoose.model<IRoom>("Room", roomSchema);
	});
};
