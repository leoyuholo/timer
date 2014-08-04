(function () {
	var root = this;

	var updateTimer = function (timer) {
		var _ = timer._;

		_.now = Date.now();
		_.remain = _.end - _.now;
		_.elapsed = _.now - _.start;

		var trigger = function (listener) {
			listener.call(null, timer);
		};

		_.events.update.forEach(trigger);

		if (_.end <= _.now) {
			_.events.end.forEach(trigger);
			_.events.end = [];
		}

		_.timeout = setTimeout(function () {updateTimer(timer);}, _.frequency - (_.elapsed % _.frequency));
	};

	var Timer = function (end, endCb, updateCb) {
		var _ = {
			now: Date.now(),
			start: Date.now(),
			end: 0,
			remain: 0,
			elapsed: 0,
			frequency: 1000,
			events: {
				end: [],
				update: []
			},
			timeout: ''
		};

		_.end = end ? end instanceof Date ? end.getTime() : 'number' === typeof end ? _.now + end : _.now + +end : 0;

		if ('function' === typeof endCb)
			_.events.end.push(endCb);
		if ('function' === typeof updateCb)
			_.events.update.push(updateCb);

		this._ = _;

		updateTimer(this);
	};

	Timer.prototype.destroy = function() {
		clearTimeout(this._.timeout);
	};

	// TODO: export to module.exports for node.js compatibility
	root.Timer = Timer;
}.call(this));
