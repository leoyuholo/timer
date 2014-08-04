(function () {
	var root = this;

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
	};

	// TODO: export to module.exports for node.js compatibility
	root.Timer = Timer;
}.call(this));
