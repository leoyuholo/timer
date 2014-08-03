(function () {
	var root = this;

	var timer = function () {

	};

	var Datetime = function () {

	};

	Datetime.dhmsRegex = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i;

	Datetime.isDhms = function (s) {
		return Datetime.dhmsRegex.test(s);
	}

	timer.Datetime = Datetime;

	// TODO: export to module.exports for node.js compatibility
	root.timer = timer;
}.call(this));