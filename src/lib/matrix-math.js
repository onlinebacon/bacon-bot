const M4_IX = 0x0;
const M4_IY = 0x1;
const M4_IZ = 0x2;
const M4_IW = 0x3;
const M4_JX = 0x4;
const M4_JY = 0x5;
const M4_JZ = 0x6;
const M4_JW = 0x7;
const M4_KX = 0x8;
const M4_KY = 0x9;
const M4_KZ = 0xA;
const M4_KW = 0xB;
const M4_LX = 0xC;
const M4_LY = 0xD;
const M4_LZ = 0xE;
const M4_LW = 0xF;

const M3_IX = 0;
const M3_IY = 1;
const M3_IZ = 2;
const M3_JX = 3;
const M3_JY = 4;
const M3_JZ = 5;
const M3_KX = 6;
const M3_KY = 7;
const M3_KZ = 8;

export class Mat3 extends Array {
	constructor(values = []) {
		super(9);
		for (let i=0; i<9; ++i) {
			if (i < values.length) {
				this[i] = values[i];
			} else {
				this[i] = (i % 4 === 0) | 0;
			}
		}
	}
	setIdentity() {
		for (let i=0; i<9; ++i) {
			this[i] = (i % 4 === 0) | 0;
		}
		return this;
	}
	set(matrix) {
		for (let i=0; i<9; ++i) {
			this[i] = matrix[i];
		}
		return this;
	}
}

export class Mat4 extends Array {
	constructor(values = []) {
		super(16);
		for (let i=0; i<16; ++i) {
			if (i < values.length) {
				this[i] = values[i];
			} else {
				this[i] = (i % 5 === 0) | 0;
			}
		}
	}
	setIdentity() {
		for (let i=0; i<16; ++i) {
			this[i] = (i % 5 === 0) | 0;
		}
		return this;
	}
	set(matrix) {
		for (let i=0; i<16; ++i) {
			this[i] = matrix[i];
		}
		return this;
	}
	apply(mat4, dst = this) {
		mulMat4ByMat4(this, mat4, dst);
		return dst;
	}
	rotateX(angle, dst = this) {
		_rotateMat4OnXAxis(this, Math.sin(angle), Math.cos(angle), dst);
		return dst;
	}
	rotateY(angle, dst = this) {
		_rotateMat4OnYAxis(this, Math.sin(angle), Math.cos(angle), dst);
		return dst;
	}
	rotateZ(angle, dst = this) {
		_rotateMat4OnZAxis(this, Math.sin(angle), Math.cos(angle), dst);
		return dst;
	}
	toMatrix() {
		const matrix = [[], [], [], []];
		for (let i=0; i<4; ++i) {
			const row = matrix[i];
			for (let j=0; j<4; ++j) {
				row[j] = Number(this[i*4 + j].toFixed(8));
			}
		}
		return matrix;
	}
	invert(dst = this) {
		tmpMat.set(this);
		dst.setIdentity();
		invertYRotOfKVec(tmpMat, dst);
		invertXRotOfKVec(tmpMat, dst);
		invertZRotOfJVec(tmpMat, dst);
		return dst;
	}
}

export class Vec3 extends Array {
	constructor([ x = 0, y = 0, z = 0 ] = []) {
		super(3);
		this[0] = x;
		this[1] = y;
		this[2] = z;
	}
	get x() { return this[0]; }
	get y() { return this[1]; }
	get z() { return this[2]; }
	set x(val) { return this[0] = val; }
	set y(val) { return this[1] = val; }
	set z(val) { return this[2] = val; }
	rotateX(angle, dst = this) {
		_rotateVec3OnXAxis(this, Math.sin(angle), Math.cos(angle), dst);
		return dst;
	}
	rotateY(angle, dst = this) {
		_rotateVec3OnYAxis(this, Math.sin(angle), Math.cos(angle), dst);
		return dst;
	}
	rotateZ(angle, dst = this) {
		_rotateVec3OnZAxis(this, Math.sin(angle), Math.cos(angle), dst);
		return dst;
	}
	len() {
		const [ x, y, z ] = this;
		return Math.sqrt(x*x + y*y + z*z);
	}
	scale(val, dst = this) {
		const [ x, y, z ] = this;
		dst[0] = x*val;
		dst[1] = y*val;
		dst[2] = z*val;
		return dst;
	}
	normalize(dst = this) {
		return this.scale(1/this.len(), dst);
	}
}

export class Vec4 extends Array {
	constructor([ x = 0, y = 0, z = 0, w = 1 ] = []) {
		super(4);
		this[0] = x;
		this[1] = y;
		this[2] = z;
		this[3] = w;
	}
	apply(mat4, dst = this) {
		mulVec4ByMat4(this, mat4, dst);
		return dst;
	}
}

const tmpMat = new Mat4();

const mulVec4ByMat4 = (vec4, mat4, dst) => {
	const [ x, y, z, w ] = vec4;
	const [
		ix, iy, iz, iw,
		jx, jy, jz, jw,
		kx, ky, kz, kw,
		lx, ly, lz, lw,
	] = mat4;

	dst[0] = x*ix + y*jx + z*kx + w*lx;
	dst[1] = x*iy + y*jy + z*ky + w*ly;
	dst[2] = x*iz + y*jz + z*kz + w*lz;
	dst[3] = x*iw + y*jw + z*kw + w*lw;
};

const mulMat4ByMat4 = (a, b, dst) => {
	const [
		aix, aiy, aiz, aiw,
		ajx, ajy, ajz, ajw,
		akx, aky, akz, akw,
		alx, aly, alz, alw,
	] = a;
	const [
		bix, biy, biz, biw,
		bjx, bjy, bjz, bjw,
		bkx, bky, bkz, bkw,
		blx, bly, blz, blw,
	] = b;

	dst[M4_IX] = aix*bix + aiy*bjx + aiz*bkx + aiw*blx;
	dst[M4_IY] = aix*biy + aiy*bjy + aiz*bky + aiw*bly;
	dst[M4_IZ] = aix*biz + aiy*bjz + aiz*bkz + aiw*blz;
	dst[M4_IW] = aix*biw + aiy*bjw + aiz*bkw + aiw*blw;

	dst[M4_JX] = ajx*bix + ajy*bjx + ajz*bkx + ajw*blx;
	dst[M4_JY] = ajx*biy + ajy*bjy + ajz*bky + ajw*bly;
	dst[M4_JZ] = ajx*biz + ajy*bjz + ajz*bkz + ajw*blz;
	dst[M4_JW] = ajx*biw + ajy*bjw + ajz*bkw + ajw*blw;

	dst[M4_KX] = akx*bix + aky*bjx + akz*bkx + akw*blx;
	dst[M4_KY] = akx*biy + aky*bjy + akz*bky + akw*bly;
	dst[M4_KZ] = akx*biz + aky*bjz + akz*bkz + akw*blz;
	dst[M4_KW] = akx*biw + aky*bjw + akz*bkw + akw*blw;

	dst[M4_LX] = alx*bix + aly*bjx + alz*bkx + alw*blx;
	dst[M4_LY] = alx*biy + aly*bjy + alz*bky + alw*bly;
	dst[M4_LZ] = alx*biz + aly*bjz + alz*bkz + alw*blz;
	dst[M4_LW] = alx*biw + aly*bjw + alz*bkw + alw*blw;
};

const _rotateMat4OnXAxis = (mat4, sin, cos, dst) => {
	const [
		ix, iy, iz, iw,
		jx, jy, jz, jw,
		kx, ky, kz, kw,
		lx, ly, lz, lw,
	] = mat4;

	dst[M4_IX] = ix;
	dst[M4_IY] = iy*cos + iz*sin;
	dst[M4_IZ] = iz*cos - iy*sin;
	dst[M4_IW] = iw;

	dst[M4_JX] = jx;
	dst[M4_JY] = jy*cos + jz*sin;
	dst[M4_JZ] = jz*cos - jy*sin;
	dst[M4_JW] = jw;

	dst[M4_KX] = kx;
	dst[M4_KY] = ky*cos + kz*sin;
	dst[M4_KZ] = kz*cos - ky*sin;
	dst[M4_KW] = kw;

	dst[M4_LX] = lx;
	dst[M4_LY] = ly*cos + lz*sin;
	dst[M4_LZ] = lz*cos - ly*sin;
	dst[M4_LW] = lw;
};

const _rotateMat4OnYAxis = (mat4, sin, cos, dst) => {
	const [
		ix, iy, iz, iw,
		jx, jy, jz, jw,
		kx, ky, kz, kw,
		lx, ly, lz, lw,
	] = mat4;

	dst[M4_IX] = ix*cos - iz*sin;
	dst[M4_IY] = iy;
	dst[M4_IZ] = iz*cos + ix*sin;
	dst[M4_IW] = iw;

	dst[M4_JX] = jx*cos - jz*sin;
	dst[M4_JY] = jy;
	dst[M4_JZ] = jz*cos + jx*sin;
	dst[M4_JW] = jw;

	dst[M4_KX] = kx*cos - kz*sin;
	dst[M4_KY] = ky;
	dst[M4_KZ] = kz*cos + kx*sin;
	dst[M4_KW] = kw;

	dst[M4_LX] = lx*cos - lz*sin;
	dst[M4_LY] = ly;
	dst[M4_LZ] = lz*cos + lx*sin;
	dst[M4_LW] = lw;
};

const _rotateMat4OnZAxis = (mat4, sin, cos, dst) => {
	const [
		ix, iy, iz, iw,
		jx, jy, jz, jw,
		kx, ky, kz, kw,
		lx, ly, lz, lw,
	] = mat4;

	dst[M4_IX] = ix*cos + iy*sin;
	dst[M4_IY] = iy*cos - ix*sin;
	dst[M4_IZ] = iz;
	dst[M4_IW] = iw;

	dst[M4_JX] = jx*cos + jy*sin;
	dst[M4_JY] = jy*cos - jx*sin;
	dst[M4_JZ] = jz;
	dst[M4_JW] = jw;

	dst[M4_KX] = kx*cos + ky*sin;
	dst[M4_KY] = ky*cos - kx*sin;
	dst[M4_KZ] = kz;
	dst[M4_KW] = kw;

	dst[M4_LX] = lx*cos + ly*sin;
	dst[M4_LY] = ly*cos - lx*sin;
	dst[M4_LZ] = lz;
	dst[M4_LW] = lw;
};

const invertYRotOfKVec = (mat, inv) => {
	const kx = mat[M4_KX];
	const kz = mat[M4_KZ];
	const len = Math.sqrt(kx*kx + kz*kz);
	if (len === 0) return;
	const cos = kz/len;
	const sin = kx/len;
	_rotateMat4OnYAxis(mat, sin, cos, mat);
	_rotateMat4OnYAxis(inv, sin, cos, inv);
};

const invertXRotOfKVec = (mat, inv) => {
	const ky = mat[M4_KY];
	const kz = mat[M4_KZ];
	const len = Math.sqrt(ky*ky + kz*kz);
	if (len === 0) return;
	const cos = kz/len;
	const sin = - ky/len;
	_rotateMat4OnXAxis(mat, sin, cos, mat);
	_rotateMat4OnXAxis(inv, sin, cos, inv);
};

const invertZRotOfJVec = (mat, inv) => {
	const jx = mat[M4_JX];
	const jy = mat[M4_JY];
	const len = Math.sqrt(jx*jx + jy*jy);
	if (len === 0) return;
	const cos = jy/len;
	const sin = - jx/len;
	_rotateMat4OnZAxis(mat, sin, cos, mat);
	_rotateMat4OnZAxis(inv, sin, cos, inv);
};

const _rotateVec3OnXAxis = (vec, sin, cos, dst) => {
	const [ x, y, z ] = vec;
	dst[0] = x;
	dst[1] = y*cos + z*sin;
	dst[2] = z*cos - y*sin;
};

const _rotateVec3OnYAxis = (vec, sin, cos, dst) => {
	const [ x, y, z ] = vec;
	dst[0] = x*cos - z*sin;
	dst[1] = y;
	dst[2] = z*cos + x*sin;
};

const _rotateVec3OnZAxis = (vec, sin, cos, dst) => {
	const [ x, y, z ] = vec;
	dst[0] = x*cos + y*sin;
	dst[1] = y*cos - x*sin;
	dst[2] = z;
};
