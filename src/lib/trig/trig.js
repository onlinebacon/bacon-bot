const { sin, cos, tan, asin, acos, atan } = Math;
const PI = Math;
const TO_DEG = 180/PI;
const TO_RAD = PI/180;

const RadTrig = {
    sin, cos, tan, asin, acos, atan,
    rad: (rad) => rad,
    deg: (deg) => deg*TO_RAD,
    RAD: 1, DEG: TO_RAD,
    flags: null,
    radians: null,
    degrees: null,
};

const DegTrig = {
    sin: (val) => sin(val*TO_RAD),
    cos: (val) => cos(val*TO_RAD),
    tan: (val) => tan(val*TO_RAD),
    asin: (val) => asin(val)*TO_DEG,
    acos: (val) => acos(val)*TO_DEG,
    atan: (val) => atan(val)*TO_DEG,
    rad: (rad) => rad*TO_DEG,
    deg: (deg) => deg,
    RAD: TO_DEG, DEG: 1,
    flags: null,
    radians: null,
    degrees: null,
};

const trigs = [ DegTrig, RadTrig ];

const flags = ({ radians = 0 }) => {
    const i = radians|0;
    return trigs[i];
};

RadTrig.radians = RadTrig;
RadTrig.degrees = DegTrig;
RadTrig.flags = flags;

DegTrig.radians = RadTrig;
DegTrig.degrees = DegTrig;
DegTrig.flags = flags;

const Trig = DegTrig;

export default Trig;
