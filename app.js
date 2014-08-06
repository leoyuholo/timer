(function () {
	var root = this;

	var app = function () {

	};

	app.getHash = function () {
		var hash = window.location.hash;

		return hash ? hash.slice(1) : '';
	};

	app.updateNow = function (timer) {

	};

	app.updateElapsed = function (timer) {

	};

	app.updateRemain = function (timer) {

	};

	app.finishCountTo = function (timer) {

	};

	app.hashError = function (hash) {

	};

	app.dispatch = function (hash) {
		if (app.timer)
			app.timer.destroy();
		
		if (!hash) {
			app.timer = new Timer(null, null, app.updateElapsed);
		} else if (Datetime.isParsable(hash)) {
			app.timer = new Timer(Datetime.makeDatetime(hash).getTime(), app.finishCountTo, app.updateRemain);
		} else {
			app.timer = new Timer(null, null, app.updateNow);
			app.hashError(hash, app.timer);
		}
	};

	app.main = function () {

		window.onhashchange = function () {
			app.dispatch(app.getHash());
		};

		app.dispatch(app.getHash());
	};

	root.app = app;
}.call(this));