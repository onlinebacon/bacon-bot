export default class EvalContext {
	constructor() {
		this.constants = {};
		this.getters = {};
		this.functions = {};
		this.flags = {};
	}
	addConstant(name, value) {
		this.constants[name] = value;
	}
	addGetter(name, fn) {
		this.getters[name] = fn;
	}
	addFunction(name, argc, call) {
		this.functions[name] = { name, argc, call };
	}
	getFunction(name) {
		return this.functions[name] ?? null;
	}
	getValue(name) {
		const constant = this.constants[name];
		if (constant !== undefined) {
			return constant;
		}
		const getter = this.getters[name];
		if (getter === undefined) {
			return null;
		}
		return getter(this);
	}
}
