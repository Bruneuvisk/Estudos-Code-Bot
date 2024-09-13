const colors = require("colors");
const moment = require("moment");

module.exports = class Logger {
	static log (content, type = "log") {
		const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
		switch (type) {

		case "log": {
			return console.log(`[${date.gray}]: [${type.toUpperCase().bgBlue}] ${content.bgBlue}`);
		}
		case "warn": {
			return console.log(`[${date.gray}]: [${type.toUpperCase().bgYellow}] ${content.bgYellow}`);
		}
		case "error": {
			return console.log(`[${date.gray}]: [${type.toUpperCase().bgRed}] ${content.bgRed}`);
		}
		case "debug": {
			return console.log(`[${date.gray}]: [${type.toUpperCase().bgGreen}] ${content.bgGreen}`);
		}
		case "cmd": {
			return console.log(`[${date.gray}]: [${type.toUpperCase().bgWhite}] ${content.bgWhite}`);
		}
		case "event": {
			return console.log(`[${date.gray}]: [${type.toUpperCase().bgWhite}] ${content.bgWhite}`);
		}
		case "ready": {
			return console.log(`[${date.gray}]: [${type.toUpperCase().bgBlue}] ${content.bgBlue}`);
		}
		default: throw new TypeError("O tipo de registrador deve ser warn, debug, log, ready, cmd ou error.");
		}
	}
};
