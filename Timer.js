(function () {
	var root = this;

	var updateTimer = function (timer) {
		var _ = timer;

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

	var Timer = function (end, endCb, updateCb, updateCb2) {
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
		_.duration = 0 === _.end ? 0 : _.end - _.start;

		if ('function' === typeof endCb)
			_.events.end.push(endCb);

		Array.prototype.slice.call(arguments, 2).forEach(function (updateCb) {
			if ('function' === typeof updateCb)
				_.events.update.push(updateCb);	
		});

		for (var key in _) {
			this[key] = _[key];
		}

		updateTimer(this);
	};

	Timer.prototype.destroy = function() {
		var _ = this;

		if (_.timeout)
			clearTimeout(_.timeout);
			_.timeout = '';
	};

	root.Timer = Timer;
}.call(this));