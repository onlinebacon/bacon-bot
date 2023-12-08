import { muteUserButton, unmuteUserButton } from "./buttons/mute-user.js";
import { micCtrlCommand } from "./commands/mic-ctrl.js";
import { testCommand } from "./commands/test.js";

export const commands = [
	testCommand,
	micCtrlCommand,
];

export const buttons = [
	muteUserButton,
	unmuteUserButton,
];
