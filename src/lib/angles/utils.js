export const abs = Math.abs;
export const round = Math.round;
export const padTwo = (val) => val.toString().replace(/^(\d)\b/, '0$1');
export const padTwoLast = (val) => padTwo(val.toFixed(1)).replace(/\.0+$/, '');
