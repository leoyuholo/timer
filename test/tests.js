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
					[['nonsense'], false]
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
					[['nonsense'], false]
				];

				test(Datetime.isDt, isDtTest);
			});

			describe('isCount', function () {

				var isCountTest = [
					[['1'], true],
					[['2345'], true],
					[['nonsense'], false]
				];

				test(Datetime.isCount, isCountTest);
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
		});

	});
});
