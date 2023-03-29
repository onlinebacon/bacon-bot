import HoursFormat from './HoursFormat.js';

class RAConverter {
	constructor(ctx, useHours) {
		this.ctx = ctx;
		this.useHours = useHours;
	}
	fromDegrees(value) {
		return this.useHours ? value/360*24 : value;
	}
	fromHours(value) {
		return this.useHours ? value : value/24*360;
	}
	toDegrees(value) {
		return this.useHours ? value/24*360 : value;
	}
	toHours(value) {
		return this.useHours ? value : value/360*24;
	}
	stringify(value) {
		return (this.useHours ? HoursFormat : this.ctx.degFormat).stringify(value);
	}
	hours() {
		return new RAConverter(this.ctx, true);
	}
	degrees() {
		return new RAConverter(this.ctx, false);
	}
	set(ctx) {
		return new RAConverter(ctx, this.useHours);
	}
}

const RightAscension = new RAConverter(null, true);
export default RightAscension;
