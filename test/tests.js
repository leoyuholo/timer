var expect = chai.expect;

describe('timer', function () {

	describe('datetime', function () {

		var stringify = function (obj) {
			return typeof obj === 'object' ? JSON.stringify(obj) : obj;
		};

		var test = function (func, tests) {

			tests.forEach(function (test) {
				it('should return ' + stringify(test[1]) + ' for ' + stringify(test[0]), function () {
					// console.log(func.apply(undefined, test[0]));
					expect(func.apply(undefined, test[0])).to.deep.equal(test[1]);
				});
			});
		};

		describe('hash test', function () {

			describe('isDhms', function () {

				var isDhmsTest = [
					[['1s'], true],
					[['22m'], true],
					[['23h'], true],
					[['4d'], true],
					[['1d12h3m4s'], true],
					[['1s2m13h4d'], false],
					[['nonsense'], false],
					[['930am6Jul2014'], false],
					[['2345'], false]
				];

				test(Datetime.isDhms, isDhmsTest);
			});

			describe('isDt', function () {

				var isDtTest = [
					[['10am'], true],
					[['1010am'], true],
					[['9pm'], true],
					[['930am6Jul2014'], true],
					[['1930am6Jul2014'], false],
					[['nonsense'], false],
					[['1d12h3m4s'], false],
					[['2345'], false]
				];

				test(Datetime.isDt, isDtTest);
			});

			describe('isCount', function () {

				var isCountTest = [
					[['1'], true],
					[['2345'], true],
					[['nonsense'], false],
					[['1d12h3m4s'], false],
					[['930am6Jul2014'], false]
				];

				test(Datetime.isCount, isCountTest);
			});

			describe('isParsable', function () {

				var isParsableTest = [
					[['1s'], true],
					[['22m'], true],
					[['23h'], true],
					[['4d'], true],
					[['1d12h3m4s'], true],
					[['1s2m13h4d'], false],
					[['nonsense'], false],
					[['10am'], true],
					[['1010am'], true],
					[['9pm'], true],
					[['930am6Jul2014'], true],
					[['1930am6Jul2014'], false],
					[['1'], true],
					[['2345'], true]
				];

				test(Datetime.isParsable, isParsableTest);
			});
		});

		describe('hash parse', function () {

			describe('parseDhms', function () {

				var parseDhmsTest = [
					[['5s'], {day:0,hour:0,minute:0,second:5}],
					[['10d14h59m0s'], {day:10,hour:14,minute:59,second:0}],
					[['1s2m13h4d'], null]
				];

				test(Datetime.parseDhms, parseDhmsTest);
			});

			describe('parseDt', function () {

				var parseDtTest = [
					[['1130am6Jul2014'], {year:2014,month:6,day:6,hour:11,minute:30,second:0}],
					[['nonsense'], null],
					[['1930am6Jul2014'], null],
					[['930am6Abc2014'], null],
					[['930am32Jul2014'], null],
					[['930am29Feb2001'], null],
					[['930am29Feb2000'], {year:2000,month:1,day:29,hour:9,minute:30,second:0}]
				];

				test(Datetime.parseDt, parseDtTest);
			});

			describe('parseCount', function () {

				var parseCountTest = [
					[['5'], 5],
					[['123'], 123],
					[['nonsense'], null]
				];

				test(Datetime.parseCount, parseCountTest);
			});
		});

		describe('factory', function () {

			describe('makeDatetime', function () {

				var now = new Date();

				var makeDatetimeTest = [
					[['5'], new Date(5 * 60)],
					[['1d12h3m4s'], new Date(129784000)],
					[['930am6Aug2014'], new Date(2014, 7, 6, 9, 30)],
					[['930am6Aug'], new Date(now.getFullYear(), 7, 6, 9, 30)],
					[['930am'], new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30) < now ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 30) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30)]
				];

				test(Datetime.makeDatetime, makeDatetimeTest);
			});
		});

		describe('displayString', function () {

			var displayStringTest = [
				[[Datetime.makeDatetime('1m2s').getTime()], '1 minute 2 seconds'],
				[[Datetime.makeDatetime('1h2s').getTime()], '1 hour 0 minutes 2 seconds']
			];

			test(Datetime.displayString, displayStringTest);
		});

		describe('shortString', function () {

			var shortStringTest = [
				[[Datetime.makeDatetime('9pm').getTime()], '21:00:00'],
				[[Datetime.makeDatetime('930pm').getTime()], '21:30:00'],
				[[Datetime.makeDatetime('93021am').getTime()], '09:30:21'],
				[[Datetime.makeDatetime('60302am6Aug2017').getTime(), 'dd/MM/yyyy HH:mm:ss'], '06/08/2017 06:03:02']
			];

			test(Datetime.shortString, shortStringTest);
		});

	});

	describe('Timer', function () {

		var clock;

		before(function () {
			clock = sinon.useFakeTimers();
		});

		after(function () {
			clock.restore();
		});

		describe('constructor', function () {

			it('should be instantiated with default properties', function () {
				var timer = new Timer();

				expect(timer._.now).to.within(Date.now() - 2, Date.now() + 2);
				expect(timer._.start).to.within(Date.now() - 2, Date.now() + 2);
				expect(timer._.end).to.equal(0);
				expect(timer._.frequency).to.equal(1000);
			});

			it('should be instantiated with end as now plus 1000ms', function () {
				var endCb = function (timer) {},
					timer = new Timer(1000, endCb);

				expect(timer._.end).to.within(Date.now() + 1000 - 2, Date.now() + 1000 + 2);
				expect(timer._.events.end).to.include(endCb);
			});

			it('should be instantiated with end as ' + Datetime.makeDatetime('1030am6Aug2030'), function () {
				var end = Datetime.makeDatetime('1030am6Aug2030'),
					endCb = function (timer) {},
					updateCb = function (timer) {},
					timer = new Timer(end, endCb, updateCb);

				expect(timer._.end).to.within(end.getTime() - 2, end.getTime() + 2);
				expect(timer._.events.end).to.include(endCb);
				expect(timer._.events.update).to.include(updateCb);
			});
		});

		describe('event listeners', function () {

			this.timeout(5000);

			it('should call end event listener exactly once after 2000ms', function (done) {
				var timer = new Timer(2000, function (timer) {
					expect(timer._.remain).to.be.at.most(0);
					done();
				});

				clock.tick(4999);
			});

			it('should call update event listener every 1000ms', function (done) {
				var called = 0,
					timer = new Timer(null, null, function (timer) {
						expect(Math.round(timer._.elapsed / 1000)).to.equal(called);
						if (called++ >= 3)
							done();
					});

				clock.tick(4999);
			});
		});

		describe('destroy', function () {

			this.timeout(5000);

			it('should not call end event listener after destroy', function (done) {
				var called = 0,
					timer = new Timer(2000, function (timer) {
						expect(++called).to.equal(0);
					});
				timer.destroy();
				setTimeout(function () {
					done();
				}, 2500);

				clock.tick(4999);
			});

			it('should not call update event listener after destroy', function (done) {
				var called = 0,
					timer = new Timer(null, null, function (timer) {
						expect(++called).to.equal(1);
					});
				timer.destroy();
				setTimeout(function () {
					done();
				}, 1500);

				clock.tick(4999);
			});
		});
	});
});
