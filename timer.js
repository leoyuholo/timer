(function () {
	var root = this;

	var Timer = function (opt) {
		if (!(this instanceof Timer)) {
			return new Timer(opt);
		} else {
			this._ = {
				now: Date.now(),
				start: Date.now(),
				end: 0,
				frequency: 1000,
				events: {},
				timeout: ''
			};
			opt = opt instanceof Date ? {end: opt.getTime()} : 'number' === typeof opt ? {end: Date.now() + opt} : opt;
			if ('object' === typeof opt) {
				for (var prop in opt) {
					this._[prop] = opt[prop];
				}
			}
			this._.remain = this._.end - this._.now;
			this._.elapsed = this._.now - this._.start;
		}
	};

	// TODO: export to module.exports for node.js compatibility
	root.Timer = Timer;
}.call(this));
