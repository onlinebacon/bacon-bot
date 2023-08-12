const cot = (deg) => 1/Math.tan(deg*(Math.PI/180));

const calcAltRefraction = (alt) => {
    if (alt > 89.9) return 0;
    return cot(alt + 7.31/(alt + 4.4))/60;
};

export default calcAltRefraction;
