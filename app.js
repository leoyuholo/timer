(function () {
	var root = this;

	var app = function () {

	};

	app.getHash = function () {
		var hash = window.location.hash;

		return hash ? hash.slice(1) : '';
	};

	app.countUp = function () {

	};

	app.countTo = function (date) {

	};

	app.dispatch = function (hash) {
		
		if (!hash) {
			app.countUp();
		} else if (Datetime.isDt(hash)) {
			app.countTo(Datetime.makeDatetime(hash));
		} else if (Datetime.isDhms(hash) || Datetime.isCount(hash)) {
			app.countTo(Date.now() + Datetime.makeDatetime(hash));
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