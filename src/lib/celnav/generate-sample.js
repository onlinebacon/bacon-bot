import Constants from '../constants/Constants.js';
import shuffle from '../random/shuffle.js';
import Skyfield from '../skyfield/skyfield.js';
import calcAzAlt from '../sphere/calc-az-alt.js';
import applyRefraction from './apply-refraction.js';
import calcDip from './calc-dip.js';
import calcGP from './calc-gp.js';
import randomUnixtime from './random-unixtime.js';
import twilightSamples from './twilight-samples.js';

const toRad = (deg) => deg/180*Math.PI;
const toDeg = (rad) => rad/Math.PI*180;
const earthRadius = Constants.earthAverageRadius;

const pickLocation = (sunGP) => {
	const samples = twilightSamples(sunGP, 36, Math.random());
	const valid = samples.filter(([ lat, _lon ]) => lat > -65 && lat < 65);
	shuffle(valid);
	return valid[0];
};

const randomDuration = () => {
	return Math.floor(Math.random()*90 + 60);
};

const randomDurations = (nReadings) => {
	return [...new Array(nReadings)].map(randomDuration);
};

const isUsable = (reading) => {
	return reading.alt > 15 && reading.alt < 75;
};

const getReadings = async (unixtime, loc, list) => {
	const observer_gp = loc.map(toRad);
	const promises = list.map(async (name) => {
		const data = await Skyfield.justGet(name, unixtime);
		const { mag } = data;
		const body_gp = calcGP(unixtime, data).map(toRad);
		const [ azm, alt ] = calcAzAlt(observer_gp, body_gp, earthRadius/data.dist).map(toDeg);
		return { name, unixtime, azm, alt, mag };
	});
	const all = await Promise.all(promises);
	return all.filter(isUsable);
};

const generateSample = async (nBodies = 3) => {
	const startTime = randomUnixtime();
	const sunData = await Skyfield.justGet('sun', startTime);
	const sunGP = calcGP(startTime, sunData);
	const loc = pickLocation(sunGP);
	const durations = randomDurations(nBodies);
	const selected = [];
	const height = Math.random()*8 + 2;
	const dip = calcDip(height);
	const index = (Math.random() - 0.5)*(5/60);
	let time = startTime;
	let list = [ ...Skyfield.planets, ...Skyfield.stars ];
	for (let dt of durations) {
		time += dt;
		const readings = shuffle(await getReadings(time, loc, list));
		const reading = readings[0];
		list = readings.map(reading => reading.name).filter(name => name != reading.name);
		selected.push(reading);
	}
	const readings = selected.map(reading => {
		const { name, unixtime, alt } = reading;
		const rawAlt = applyRefraction(alt) + dip + index;
		return { name, unixtime, alt: rawAlt };
	});
	return { loc, height, index, readings };
};

export default generateSample;
