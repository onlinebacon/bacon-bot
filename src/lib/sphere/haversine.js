const { sin, cos, acos } = Math;
const haversine = ([ lat1, lon1 ], [ lat2, lon2 ]) => {
    return acos(
        sin(lat1)*sin(lat2) +
        cos(lat1)*cos(lat2)*cos(lon1 - lon2)
    );
};
export default haversine;
