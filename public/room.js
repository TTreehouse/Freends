const roomTitle = document.querySelector(".title");
const roomIdText = document.querySelector(".room-id");
const calenderContainer = document.querySelector(".calender-container");
const daySelectors = document.querySelectorAll(".day-container");
const submit = document.querySelector(".btn");
const availableContainer = document.querySelector(".available-container");
const availDays = document.querySelectorAll(".avail-day");
const backBtn = document.querySelector(".back");
const copyBtn = document.querySelector(".fa-copy");
const refreshBtn = document.querySelector(".refresh");
const webTitle = document.querySelector("title");

const baseURL = "https://www.freends.me/";

let userID = null;

let roomCode = window.location.href.substring(
	window.location.href.length - 36,
	window.location.length
);

//

let daysOfWeek = [
	"sunday",
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
];

let selectedDays = [];

const postData = async (url, data = {}) => {
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	return response.json();
};

const sortBest = (data) => {
	let items = Object.keys(data.bestDays).map((key) => {
		return [key, data.bestDays[key].userCount];
	});
	items.sort((first, second) => {
		return second[1] - first[1];
	});
	let sorted = [];
	for (item of items) {
		sorted.push(parseInt(item[0]));
	}
	for (day of data.bestDays) {
		sorted[sorted.indexOf(day.day)] = day;
	}

	return sorted;
};

const setUpRoom = async () => {
	let roomData = await postData(baseURL + "api/rooms", {
		id: roomCode,
	});

	roomTitle.textContent = roomData.roomName;
	webTitle.textContent = roomData.roomName;
	roomIdText.textContent = roomData.roomId;

	setupCalendar(
		new Date(roomData.startDate).getDay(),
		new Date(roomData.startDate)
	);

	let sorted = sortBest(roomData);

	setupDays(
		new Date(roomData.startDate).getDay(),
		new Date(roomData.startDate),
		sorted
	);
};

setUpRoom();

// const updateDayAvail(dayAvail){
// 	dayAvail.
// }

const highlight = (day) => {
	//check for red square
	if (day.style.backgroundColor === "rgb(249, 57, 67)") {
		day.style.backgroundColor = "rgba(239, 241, 243, 0.6)"; //set default white
		return selectedDays.splice(
			selectedDays.indexOf(selectedDays.indexOf(day)),
			1
		);
	} //check for dull red square
	else if (day.style.backgroundColor === "rgba(252, 81, 48, 0.6)") {
		day.style.backgroundColor = "rgba(239, 241, 243, 0.87)"; //set bright white
		return selectedDays.splice(
			selectedDays.indexOf(selectedDays.indexOf(day)),
			1
		);
	}
	day.style.backgroundColor = "rgb(249, 57, 67)"; //set bright red

	selectedDays.push(day);
};

const indexOfDay = (_day) => {
	for ([i, day] of daySelectors.entries()) {
		if (_day === day) {
			return i;
		}
	}
};

const submitDates = async (dates) => {
	console.log(userID);
	if (!userID) {
		let response = await postData(baseURL + "api/rooms/adduser", {
			id: roomCode,
			user: {
				name: "Jimmy",
				availableDays: dates,
			},
		});
		userID = response.users[response.users.length - 1].userId;
		let sorted = sortBest(response);
		setupDays(
			new Date(response.startDate).getDay(),
			new Date(response.startDate),
			sorted
		);
	} else {
		let response = await postData(baseURL + "api/rooms/adduser", {
			id: roomCode,
			user: {
				name: "Jimmy",
				availableDays: dates,
				userId: userID,
			},
		});
		let sorted = sortBest(response);
		setupDays(
			new Date(response.startDate).getDay(),
			new Date(response.startDate),
			sorted
		);
	}
};

const refresh = async () => {
	let response = await postData(baseURL + "api/rooms/", {
		id: roomCode,
	});
	let sorted = sortBest(response);
	setupDays(
		new Date(response.startDate).getDay(),
		new Date(response.startDate),
		sorted
	);
};

const setupCalendar = (startDay, startDate) => {
	for (const [i, day] of daySelectors.entries()) {
		day.childNodes[1].textContent = daysOfWeek[(startDay + i) % 7]
			.substring(0, 1)
			.toUpperCase();
		let date = new Date(startDate);
		date.setDate(date.getDate() + i);
		date =
			date.getDate() +
			" " +
			new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);

		day.childNodes[3].textContent = date;

		day.addEventListener("click", () => highlight(i));
	}
};

const setupDays = (startDay, startDate, bestDays) => {
	availableContainer.innerHTML = "";

	for (day of bestDays) {
		let div = document.createElement("div");
		let dayTitle = document.createElement("div");
		let dateTitle = document.createElement("div");
		let userContainer = document.createElement("div");

		dayTitle.classList = "sub-title";
		userContainer.classList = "users row";
		dateTitle.style.fontSize = "0.5em";
		dateTitle.style.color = "rgba(239, 241, 243, 0.6)";

		dayTitle.textContent = daysOfWeek[(day.day + startDay) % 7];

		let date = new Date(startDate);
		date.setDate(date.getDate() + day.day);
		date =
			date.getDate() +
			" " +
			new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
		dateTitle.textContent = date;

		availableContainer.appendChild(div);
		div.appendChild(dayTitle);
		div.appendChild(userContainer);
		dayTitle.appendChild(dateTitle);

		for (user of day.users) {
			let userDiv = document.createElement("div");
			userDiv.classList = "user";
			userDiv.textContent = user + ", ";
			userContainer.appendChild(userDiv);
		}

		if (userContainer.childNodes.length > 0) {
			userContainer.childNodes[
				userContainer.childNodes.length - 1
			].textContent = userContainer.childNodes[
				userContainer.childNodes.length - 1
			].textContent.replace(/,/g, "");
		}
	}
};

const invertDates = (dates) => {
	temp = dates;
	for (let i = 0; i < 14; i++) {
		if (temp.includes(i)) {
			temp.splice(dates.indexOf(i), 1);
		} else temp.push(i);
	}
	return temp;
};

refreshBtn.addEventListener("click", () => {
	refresh();
});

backBtn.addEventListener("click", () => {
	history.back();
	history.go(-1);
});

function copy() {
	const textHolder = document.createElement("textarea");
	textHolder.value = window.location;
	document.body.appendChild(textHolder);
	textHolder.select();
	document.execCommand("copy");
	document.body.removeChild(textHolder);
}

copyBtn.addEventListener("click", copy);
submit.onclick = () => {
	for (day of daySelectors) {
		if (selectedDays.includes(indexOfDay(day))) {
			day.style.backgroundColor = "rgba(249, 57, 67, 0.6)"; //dulls selected squares
		} else {
			day.style.backgroundColor = "rgba(239, 241, 243, 0.6)"; //resets all unselected squares to default;
		}
	}
	submitDates(invertDates([...selectedDays]));
};
