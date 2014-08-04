(function () {
	var root = this;

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

	Datetime.dtRegex = /^(10|11|12|[0-9])([0-5][0-9])?([0-5][0-9])?([ap]m)(?:(\d{1,2})(jan|january|feb|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|september|oct|october|nov|november|dec|december)(\d{4})?)?$/i;

	Datetime.isDt = function (s) {
		var res = Datetime.dtRegex.exec(s);

		if (null === res) {
			return false;
		} else {
			var now = new Date(),
				hour = +res[1] + ('pm' === res[4] ? 12 : 0),
				minute = res[2] ? +res[2] : 0,
				second = res[3] ? +res[3] : 0,
				day = res[5] ? +res[5] : now.getDate(),
				month = res[6] ? monthMapping[res[6].substring(0, 3).toLowerCase()] : now.getMonth(),
				year = res[7] ? +res[7] : now.getFullYear(),
				testDate = new Date(year, month, day, hour, minute, second);

			if (!(testDate.getFullYear() === year && testDate.getMonth() === month && testDate.getDate())) {
				return false;
			} else {
				return true;
			}
		}

	};

	Datetime.parseDt = function (s) {

		if (!Datetime.isDt(s)) {
			return null;
		} else {
			var res = Datetime.dtRegex.exec(s);

			return {
				hour: +res[1] + ('pm' === res[4] ? 12 : 0),
				minute: res[2] ? +res[2] : 0,
				second: res[3] ? +res[3] : 0,
				day: res[5] ? +res[5] : null,
				month: res[6] ? monthMapping[res[6].substring(0, 3).toLowerCase()] : null,
				year: res[7] ? +res[7] : null
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

	Datetime.isParsable = function (s) {
		return Datetime.isDhms(s) || Datetime.isDt(s) || Datetime.isCount(s);
	};

	Datetime.makeDatetime = function (s) {

		if (Datetime.isCount(s)) {
			return new Date(60 * Datetime.parseCount(s));
		} else if (Datetime.isDhms(s)) {
			var dhms = Datetime.parseDhms(s);

			return new Date((86400 * dhms.day + 3600 * dhms.hour + 60 * dhms.minute + dhms.second) * 1000);
		} else if (Datetime.isDt(s)) {
			var dt = Datetime.parseDt(s),
				now = new Date();

			if (!dt.year) {
				dt.year = now.getFullYear();
			}

			if (!dt.day) {
				var testDate = new Date();
				testDate.setHours(dt.hour);
				testDate.setMinutes(dt.minute);
				testDate.setSeconds(dt.second);
				if (testDate < now) {
					dt.day = now.getDate() + 1;
				}
				dt.month = now.getMonth();
			}

			return new Date(dt.year, dt.month, dt.day, dt.hour, dt.minute, dt.second);
		} else {
			return null;
		}
	};

	root.Datetime = Datetime;
}.call(this));
