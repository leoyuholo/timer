var expect = chai.expect;

var Datetime = timer.Datetime

describe('timer', function () {

	describe('datetime', function () {

		describe('hash test', function () {

			describe('isDhms', function () {

				it('should return true for "1s"', function () {
					expect(Datetime.isDhms('1s')).to.be.true;
				});

				it('should return true for "2m"', function () {
					expect(Datetime.isDhms('2m')).to.be.true;
				});

				it('should return true for "3h"', function () {
					expect(Datetime.isDhms('3h')).to.be.true;
				});

				it('should return true for "4d"', function () {
					expect(Datetime.isDhms('4d')).to.be.true;
				});

				it('should return true for "1d2h3m4s"', function () {
					expect(Datetime.isDhms('1d2h3m4s')).to.be.true;
				});

				it('should return false for "nonsense"', function () {
					expect(Datetime.isDhms('nonsense')).to.be.false;
				});

				it('should return false for "1s2m3h4d"', function () {
					expect(Datetime.isDhms('1s2m3h4d')).to.be.false;
				});
			});
		});
	});
});
