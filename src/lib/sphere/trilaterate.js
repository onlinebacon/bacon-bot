import calcAzimuth from './calc-azimuth.js';
import calcSignedAngle from './calc-signed-angle.js';
import haversine from './haversine.js';
import icoPoints from './ico-points.js';
import shoot from './shoot.js';

const { sqrt, sin, cos } = Math;

const vecLen = (x, y) => sqrt(x**2 + y**2);
const azimuthalPlot = (azm, rad) => [ sin(azm)*rad, cos(azm)*rad ];

class SmartSearcher {
    constructor(coord, circles) {
        this.coord = coord;
        this.circles = circles;
        this.lastChange = null;
        this.error = null;
    }
    iterate() {
        const { coord, circles } = this;
        let x = 0, y = 0, dMax = 0;
        for (const circle of circles) {
            const { center, radius } = circle;
            const d = haversine(center, coord) - radius;
            const azm = calcAzimuth(coord, center);
            const [ dx, dy ] = azimuthalPlot(azm, d);
            x += dx;
            y += dy;
            dMax = Math.max(dMax, d);
        }
        const azm = calcSignedAngle(y, x);
        const rad = Math.min(dMax, vecLen(x, y))*0.5;
        this.coord = shoot(coord, azm, rad);
        this.lastChange = rad;
        return this;
    }
    updateError() {
        const { coord, circles } = this;
        let error = 0;
        for (const circle of circles) {
            const { center, radius } = circle;
            const d = haversine(center, coord) - radius;
            error += d**2;
        }
        this.error = error;
    }
}

const trilaterate = (circles, iterations = 60) => {
    const searchers = icoPoints.map(coord => new SmartSearcher(coord, circles));
    for (let i=0; i<iterations; ++i) {
        for (let s of searchers) {
            s.iterate();
        }
    }
    for (let s of searchers) {
        s.updateError();
    }
    const { coord, error } = searchers.reduce((a, b) => a.error < b.error ? a : b);
    return { coord, error };
};

export default trilaterate;
