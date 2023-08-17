import DegFormats from '../angles/DegFormats.js';
import RightAscension from '../angles/RightAscension.js';
import LengthUnits from '../length-units/LengthUnits.js';
import LatLon from '../angles/LatLon.js';
import HoursFormat from '../angles/HoursFormat.js';
import Trig from '../trig/trig.js';

export default class Context {
	constructor({ msg }) {
		this.msg = msg;
		this.trig = new Trig().useDegrees();
		this.degFormat = DegFormats;
		this.lengthUnit = LengthUnits;
		this.ra = RightAscension.set(this);
		this.latLon = LatLon.set(this);
		this.hoursFormat = HoursFormat.set(this);
	}
}
