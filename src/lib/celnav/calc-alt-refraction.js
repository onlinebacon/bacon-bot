const cot = (deg) => 1/Math.tan(deg*(Math.PI/180));

const refMultiplier = (pMb, tempC) => {
    return pMb/1010*283/(273 + tempC);
};

const calcAltRefraction = (alt, pMb = 1010, tempC = 10) => {
    if (alt > 89.9) return 0;
    const ref = cot(alt + 7.31/(alt + 4.4))/60;
    const m = refMultiplier(pMb, tempC);
    return ref*m;
};

export default calcAltRefraction;
