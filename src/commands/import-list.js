import { muteUserButton, unmuteUserButton } from "./buttons/mute-user.js";
import { micCtrlCommand } from "./commands/mic-ctrl.js";

export const commands = [
	micCtrlCommand,
];

export const buttons = [
	muteUserButton,
	unmuteUserButton,
];
