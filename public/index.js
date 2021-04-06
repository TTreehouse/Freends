const header = document.querySelector(".welcome");
const inputs = document.querySelectorAll(".input-field");
const createBtn = document.querySelector(".create");
const username = document.querySelector(".name");
const roomName = document.querySelector(".room-name");
const errorField = document.querySelector(".error");
const loadingSym = document.querySelector(".load-sym");
const input8 = inputs[0];
const inputs4 = [inputs[1], inputs[2], inputs[3]];
const input12 = inputs[4];

const roomURL = "https://www.freends.me/room?id=";

const hellos = [
	"hallo",
	"Përshëndetje",
	"ሰላም",
	"مرحبا",
	"Բարեւ",
	"Salam",
	"Kaixo",
	"добры дзень",
	"হ্যালো",
	"zdravo",
	"Здравейте",
	"Hola",
	"Hello",
	"Moni",
	"您好",
	"Bonghjornu",
	"zdravo",
	"Ahoj",
	"Hej",
	"Hallo",
	"Saluton",
	"Tere",
	"Hello",
	"Hei",
	"Bonjour",
	"Hello",
	"Ola",
	"გამარჯობა",
	"Hallo",
	"Γεια σας",
	"હેલો",
	"Bonjou",
	"Sannu",
	"Alohaʻoe",
	"שלום",
	"नमस्ते",
	"Nyob zoo",
	"Helló",
	"Halló",
	"Ndewo",
	"Halo",
	"Dia duit",
	"Ciao",
	"こんにちは",
	"Hello",
	"ಹಲೋ",
	"Сәлем",
	"ជំរាបសួរ",
	"안녕하세요",
	"Hello",
	"салам",
	"ສະບາຍດີ",
	"salve",
	"Labdien!",
	"Sveiki",
	"Moien",
	"Здраво",
	"ഹലോ",
	"Hiha",
	"हॅलो",
	"Сайн байна уу",
	"မင်္ဂလာပါ",
	"नमस्ते",
	"Hallo",
	"سلام",
	"سلام",
	"Cześć",
	"Olá",
	"ਹੈਲੋ",
	"Alo",
	"привет",
	"Talofa",
	"Hello",
	"Здраво",
	"هيلو",
	"හෙලෝ",
	"ahoj",
	"Pozdravljeni",
	"Hola",
	"halo",
	"Sawa",
	"Hallå",
	"Салом",
	"ஹலோ",
	"హలో",
	"สวัสดี",
	"Merhaba",
	"Здрастуйте",
	"ہیلو",
	"Salom",
	"Xin chào",
	"Helo",
	"Sawubona",
	"העלא",
	"Kaabo",
	"Sawubona",
];

header.textContent = `${
	hellos[Math.floor(Math.random() * hellos.length)]
}, welcome to freends`;

//code example xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

loadingSym.style.display = "none";

const postData = async (url, data = {}) => {
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			throw new error(response);
		} else {
			return response.json();
		}
	} catch (error) {
		return error;
	}
};

const lockInput = (e, limit) => {
	e.target.value = e.target.value.replace(/[\W_]+/g, "");
	if (e.target.value.length > limit) {
		e.target.value = e.target.value.substring(0, limit);

		if (limit !== 12) {
			e.target.nextElementSibling.focus();
		}
	}

	e.target.value = e.target.value.toLowerCase();
};

const emptyField = (field) => {
	field.classList.add("empty-field");
	if (!/\*/g.test(field.placeholder)) {
		field.placeholder += "*";
	}
	field.addEventListener("input", () => {
		field.placeholder = field.placeholder.replace(/\*/g, "");
		field.classList.remove("empty-field");
	});
};

const handlePaste = (code) => {
	input8.value = code.substring(0, 8);
	input12.value = code.substring(20, 32);
	for (let i = 0; i < 3; i++) {
		inputs4[i].value = code.substring(8 + i * 4, 12 + i * 4);
	}
	checkCode(code);
};

const checkCode = async (code) => {
	if (!code) {
		code =
			input8.value +
			inputs4[0].value +
			inputs4[1].value +
			inputs[2].value +
			input12.value;
	}
	apiCode =
		input8.value +
		"-" +
		inputs4[0].value +
		"-" +
		inputs4[1].value +
		"-" +
		inputs4[2].value +
		"-" +
		input12.value;

	if (code.length !== 32) {
		return;
	}
	if (!username.value) {
		return emptyField(username);
	}

	loadingSym.style.display = "block";
	username.disabled = true;
	username.style.color = "rgba(239, 241, 243, 0.38)";

	inputs.forEach((input) => {
		input.disabled = true;
		input.style.color = "rgba(239, 241, 243, 0.38)";
	});

	let response = await postData("https://www.freends.me/api/rooms/", {
		id: apiCode,
	});

	if (response instanceof Error) {
		errorField.textContent = "room not found";
		loadingSym.style.display = "none";
		username.style.color = "rgba(255, 250, 255, 0.87)";
		username.disabled = false;
		inputs.forEach((input) => {
			input.style.color = "rgba(255, 250, 255, 0.87)";
			input.disabled = false;
			input.value = "";
			input.addEventListener("input", () => {
				errorField.textContent = "";
			});
		});
	} else {
		document.cookie = `username-${response.roomId}=${username.value}; expires=${
			new Date() + 1
		}`;
		history.pushState(
			{ additionalInformation: "Updated the URL with JS" },
			response.roomName,
			window.location + "room?id=" + response.roomId
		);
		loadingSym.style.display = "none";
		history.go(0);
	}
};

const badRoom = () => {
	inputs.forEach((field) => {
		field.value = "";
	});
};

const createRoom = async () => {
	if (!username.value && !roomName.value) {
		emptyField(username);
		return emptyField(roomName);
	}

	if (!roomName.value) {
		return emptyField(roomName);
	}
	if (!username.value) {
		return emptyField(username);
	}

	loadingSym.style.display = "block";
	username.disabled = true;
	roomName.disabled = true;

	username.style.color = "rgba(239, 241, 243, 0.87)";
	roomName.style.color = "rgba(239, 241, 243, 0.38)";

	const response = await postData(
		"https://www.freends.me/api/rooms/createroom",
		{
			name: roomName.value,
		}
	);

	if (response instanceof Error) {
		errorField.textContent = "fatal server error";
	} else {
		loadingSym.style.display = "none";
		document.cookie = `username-${response.roomId}=${username.value}; expires=${
			new Date() + 1
		}`;
		history.pushState(
			{ additionalInformation: "Updated the URL with JS" },
			response.roomName,
			window.location + "room?id=" + response.roomId
		);
		history.go(0);
	}

	username.style.color = "rgba(239, 241, 243, 1)";
	roomName.style.color = "rgba(239, 241, 243, 1)";
	username.disabled = false;
	roomName.disabled = false;
	loadingSym.style.display = "none";
};

inputs4.forEach((element) => {
	element.addEventListener("input", (e) => {
		let code = e.target.value.replace(/-/g, "");
		if (code.length === 32) {
			handlePaste(code);
		} else if (e.target.value.length === 4) {
			checkCode();
		}
		lockInput(e, 4);
	});
});

input12.addEventListener("input", (e) => {
	let code = e.target.value.replace(/-/g, "");
	if (code.length === 32) {
		handlePaste(code);
	} else if (e.target.value.length === 12) {
		checkCode();
	}
	lockInput(e, 12);
});

input8.addEventListener("input", (e) => {
	let code = e.target.value.replace(/-/g, "");
	if (code.length === 32) {
		handlePaste(code);
	} else if (e.target.value.length === 8) {
		checkCode();
	}
	lockInput(e, 8);
});

inputs.forEach((input) => {
	input.addEventListener("input", () => {
		errorField.textContent = "";
	});
});

username.addEventListener("change", () => {
	console.log(document.cookie);
	checkCode();
});

createBtn.addEventListener("click", () => {
	createRoom();
	errorField.textContent = "";
});

roomName.addEventListener("input", () => {
	errorField.textContent = "";
});
