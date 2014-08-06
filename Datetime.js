(function () {
	var root = this;

	var Datetime = function () {

	};

	Datetime.dayCount = 86400000;
	Datetime.hourCount = 3600000;
	Datetime.minuteCount = 60000;
	Datetime.secondCount = 1000;

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
			};
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
	};

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
			return new Date(Datetime.minuteCount * Datetime.parseCount(s));
		} else if (Datetime.isDhms(s)) {
			var dhms = Datetime.parseDhms(s);

			return new Date(Datetime.dayCount * dhms.day + Datetime.hourCount * dhms.hour + Datetime.minuteCount * dhms.minute + Datetime.secondCount * dhms.second);
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

	Datetime.displayString = function (time, precision, purals) {
		time = Math.abs(time);
		precision = precision || 'second';
		var dhmsMapping = {
				day: 0,
				hour: 1,
				minute: 2,
				second: 3,
				millisecond: 4
			},
			dhms = [
				Math.floor(time / Datetime.dayCount),
				Math.floor(time / Datetime.hourCount) % 24,
				Math.floor(time / Datetime.minuteCount) % 60,
				Math.floor(time / Datetime.secondCount) % 60,
				time % 1000
			],
			dictionary = purals || [
				['day', 'days'],
				['hour', 'hours'],
				['minute', 'minutes'],
				['second', 'seconds'],
				['millisecond', 'milliseconds']
			],
			firstNonZero = 0;

		return dhms.map(function (val, index) {
			if ((val === 0 && firstNonZero === 0 && index < dhmsMapping[precision]) || index > dhmsMapping[precision]) {
				return false;
			} else {
				firstNonZero = index;
				return val + ' ' + (1 === val ? dictionary[index][0] : dictionary[index][1]);
			}
		}).filter(function (str) {return str;}).join(' ');
	};

	Datetime.shortDtFormat = 'HH:mm:ss';
	Datetime.longDtFormat = 'dd/MM/yyyy HH:mm:ss';

	var pad0 = function (n) {
		return n < 10 ? '0' + n : n;
	};

	var subFormat = function (pattern, sub, map) {
		map = map || function (val) {return val;};
		return function (format) {
			return format.split(pattern).map(map).join(sub);
		};
	};

	Datetime.shortString = function (date, format) {
		format = format || Datetime.shortDtFormat;
		if ('number' === typeof date)
			date = new Date(date);

		return subFormat('yyyy', date.getFullYear(),
			subFormat('MM', pad0(date.getMonth() + 1),
				subFormat('dd', pad0(date.getDate()),
					subFormat('HH', pad0(date.getHours()),
						subFormat('mm', pad0(date.getMinutes()),
							subFormat('ss', pad0(date.getSeconds()))
						)
					)
				)
			)
		)(format);
	};

	root.Datetime = Datetime;
}.call(this));
