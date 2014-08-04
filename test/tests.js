var expect = chai.expect;

var Datetime = timer.Datetime;

describe('timer', function () {

	describe('datetime', function () {

		describe('hash test', function () {

			var test = function (func, tests) {

				tests.forEach(function (test) {
					it('should return ' + test[1] + ' for ' + test[0], function () {
						expect(func.apply(undefined, test[0])).to.equal(test[1]);
					});
				});
			};

			describe('isDhms', function () {

				var isDhmsTest = [
					[['1s'], true],
					[['2m'], true],
					[['3h'], true],
					[['4d'], true],
					[['1d2h3m4s'], true],
					[['1s2m3h4d'], false],
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
	});
});
