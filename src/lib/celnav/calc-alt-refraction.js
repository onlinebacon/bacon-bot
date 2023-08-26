const cot = (deg) => 1/Math.tan(deg*(Math.PI/180));

const refMultiplier = (milibars, celsius) => {
    return milibars/1010*283/(273 + celsius);
};

const calcAltRefraction = (alt, milibars = 1010, celsius = 10) => {
    if (alt > 89.9) return 0;
    const ref = cot(alt + 7.31/(alt + 4.4))/60;
    const m = refMultiplier(milibars, celsius);
    return ref*m;
};

export default calcAltRefraction;
