const NS = [ 'N ', 'S ' ];
const EW = [ 'E ', 'W ' ];
const PM = [ '+', '-' ];
class LatLonConverter {
	constructor(ctx, useNSEW) {
		this.ctx = ctx;
		this.useNSEW = useNSEW;
	}
	stringifyLat(lat) {
		const prefix = this.useNSEW ? NS : PM;
		return this.ctx.degFormat.stringify(lat, prefix);
	}
	stringifyLon(lon) {
		const prefix = this.useNSEW ? EW : PM;
		return this.ctx.degFormat.stringify(lon, prefix);
	}
	stringify([ lat, lon ]) {
		return this.stringifyLat(lat) + ', ' + this.stringifyLon(lon);
	}
	nsew() {
		return new LatLonConverter(this.ctx, true);
	}
	plmn() {
		return new LatLonConverter(this.ctx, false);
	}
	set(ctx) {
		return new LatLonConverter(ctx, this.useNSEW);
	}
}
const LatLon = new LatLonConverter(null, true);
export default LatLon;
