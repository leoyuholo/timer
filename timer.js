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

	var monthMapping = {
		'jan': 0,
		'feb': 1,
		'mar': 2,
		'apr': 3,
		'may': 4,
		'jun': 5,
		'jul': 6,
		'aug': 7,
		'sep': 8,
		'oct': 9,
		'nov': 10,
		'dev': 11
	};

	Datetime.parseDt = function (s) {
		var res = Datetime.dtRegex.exec(s);

		if (null === res) {
			return null;
		} else {
			return {
				hour: +res[1] + ('pm' === res[4] ? 12 : 0),
				minute: res[2] ? +res[2] : 0,
				second: res[3] ? +res[3] : 0,
				day: res[5] ? +res[5] : null,
				month: res[6] ? monthMapping[res[6].substring(0, 3).toLowerCase()] : null,
				year: res[7] ? +res[7] : res[5] ? new Date().getFullYear() : null
			};
		}
	}

	Datetime.countRegex = /^(\d+)$/;

	Datetime.isCount = function (s) {
		return Datetime.countRegex.test(s);
	};

	Datetime.parseCount = function (s) {
		var res = Datetime.countRegex.exec(s);

		if (null === res) {
			return null;
		} else {
			return +res[1];
		}
	};

	timer.Datetime = Datetime;

	// TODO: export to module.exports for node.js compatibility
	root.timer = timer;
}.call(this));
