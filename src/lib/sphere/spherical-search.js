const { PI, sin, cos, asin, acos, sqrt } = Math;
const applyCoord = ([ x, y, z ], [ lat, lon ]) => {
    const sinlat = sin(lat);
    const coslat = cos(lat);
    const sinlon = sin(lon);
    const coslon = cos(lon);
    [ y, z ] = [ y*coslat + z*sinlat, z*coslat - y*sinlat ];
    [ x, z ] = [ x*coslon + z*sinlon, z*coslon - x*sinlon ];
    return [ x, y, z ];
};
const calcCoord = ([ x, y, z ]) => {
    const lat = asin(y);
    const rad = sqrt(x*x + z*z);
    if (rad === 0) return [ lat, 0 ];
    const tmp = acos(z/rad);
    const lon = x >= 0 ? tmp : -tmp;
    return [ lat, lon ];
};
const createSpiral = (coord, radius, nPoints, nTurns) => {
    const vecs = [];
    for (let i=0; i<nPoints; ++i) {
        const prog = Math.pow(i/(nPoints - 1), 0.75);
        const rad = radius*prog;
        const dir = (prog*nTurns)%1*2*PI;
        const sinrad = sin(rad);
        const vec = [ sin(dir)*sinrad, cos(dir)*sinrad, cos(rad) ];
        vecs.push(calcCoord(applyCoord(vec, coord)));
    }
    return vecs;
};
const sphericalSearch = (fn) => {
    const res = {
        coord: [ 0, 0 ],
        value: fn([ 0, 0 ]),
    };
    for (let rad=PI; rad>1e-8; rad/=2.5) {
        const coords = createSpiral(res.coord, rad, 55, 6);
        for (const coord of coords) {
            const value = fn(coord);
            if (value < res.value) {
                res.value = value;
                res.coord = coord;
            }
        }
    }
    return res.coord;
};
export default sphericalSearch;
