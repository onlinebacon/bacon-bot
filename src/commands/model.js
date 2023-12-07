export class Command {
	constructor({
		name = '',
		description = '',
		run = async () => {},
	}) {
		this.name = name;
		this.description = description;
		this.run = run;
	}
}
