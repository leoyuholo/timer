var expect = chai.expect;

var Datetime = timer.Datetime;

describe('timer', function () {

	describe('datetime', function () {

		var stringify = function (obj) {
			return typeof obj === 'object' ? JSON.stringify(obj) : obj;
		}

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
					[['930am'], new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30) < now ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 30) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30)],
				];

				test(Datetime.makeDatetime, makeDatetimeTest);
			});
		});

	});
});
