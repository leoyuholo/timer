(function () {
	var root = this;

	var timer = function () {

	};

	var Datetime = function () {

	};

	Datetime.dhmsRegex = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i;

	Datetime.isDhms = function (s) {
		return Datetime.dhmsRegex.test(s);
	};

	Datetime.parseDhms = function (s) {
		var res = Datetime.dhmsRegex.exec(s);

		if (null === res) {
			return null;
		} else {
			return {
				day: res[1] ? +res[1] : 0,
				hour: res[2] ? +res[2] : 0,
				minute: res[3] ? +res[3] : 0,
				second: res[4] ? +res[4] : 0
			}
		}
	};

	Datetime.dtRegex = /^(10|11|12|[0-9])([0-5][0-9])?([0-5][0-9])?([ap]m)(?:(\d{1,2})(jan|january|feb|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|september|oct|october|nov|november|dec|december)(\d{4})?)?$/i;

	Datetime.isDt = function (s) {
		return Datetime.dtRegex.test(s);
	};

	Datetime.countRegex = /^(\d+)$/;

	Datetime.isCount = function (s) {
		return Datetime.countRegex.test(s);
	};

	timer.Datetime = Datetime;

	// TODO: export to module.exports for node.js compatibility
	root.timer = timer;
}.call(this));
