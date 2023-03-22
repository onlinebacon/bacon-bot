const cot = (deg) => 1/Math.tan(deg*(Math.PI/180));

const calcAltRefraction = (alt) => {
    return cot(alt + 7.31/(alt + 4.4))/60;
};

export default calcAltRefraction;
