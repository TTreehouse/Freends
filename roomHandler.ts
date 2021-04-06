import { v4 as uuidv4 } from "uuid";
import { IRoom } from "./db";

export { createRoomId, createUserId, calculateBestDays };

let createRoomId = () => {
	return uuidv4();
};

let createUserId = () => {
	return uuidv4();
};

let calculateBestDays = (room: IRoom) => {
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
