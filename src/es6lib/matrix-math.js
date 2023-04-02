export const sinCosRotXVec3 = ([ x, y, z ], sin, cos, dst) => {
	dst[0] = x;
	dst[1] = y*cos + z*sin;
	dst[2] = z*cos - y*sin;
};

export const sinCosRotYVec3 = ([ x, y, z ], sin, cos, dst) => {
	dst[0] = x*cos - z*sin;
	dst[1] = y;
	dst[2] = z*cos + x*sin;
};

export const sinCosRotZVec3 = ([ x, y, z ], sin, cos, dst) => {
	dst[0] = x*cos + y*sin;
	dst[1] = y*cos - x*sin;
	dst[2] = z;
};

export const rotXVec3 = (vec3, angle, dst) => {
	sinCosRotXVec3(vec3, Math.sin(angle), Math.cos(angle), dst);
};

export const rotYVec3 = (vec3, angle, dst) => {
	sinCosRotYVec3(vec3, Math.sin(angle), Math.cos(angle), dst);
};

export const rotZVec3 = (vec3, angle, dst) => {
	sinCosRotZVec3(vec3, Math.sin(angle), Math.cos(angle), dst);
};
