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

	app.countUp = function (timer) {

	};

	app.countTo = function (timer) {

	};

	app.hashError = function (hash) {

	};

	app.dispatch = function (hash) {
		if (app.timer)
			app.timer.destroy();
		
		if (!hash) {
			app.timer = new Timer(null, null, app.countUp);
		} else if (Datetime.isDt(hash)) {
			app.timer = new Timer(Datetime.makeDatetime(hash), app.countTo, app.updateNow);
		} else if (Datetime.isDhms(hash)) {
			app.timer = new Timer(Datetime.makeDatetime(hash).getTime(), app.countTo, app.updateNow);
		} else if (Datetime.isCount(hash)) {
			app.timer = new Timer(Datetime.parseCount(hash) * 360000, app.countTo, app.updateNow);
		} else {
			app.timer = new Timer(null, null, app.updateNow);
			app.hashError(hash);
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