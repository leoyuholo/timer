var expect = chai.expect;

var root = this;

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

		describe('makeDatetime', function () {

			var now = new Date();

			var makeDatetimeTest = [
				[['5'], new Date(5 * 60000)],
				[['1d12h3m4s'], new Date(129784000)],
				[['930am6Aug2014'], new Date(2014, 7, 6, 9, 30)],
				[['930am6Aug'], new Date(now.getFullYear(), 7, 6, 9, 30)],
				[['930am'], new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30) < now ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 30) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30)]
			];

			test(Datetime.makeDatetime, makeDatetimeTest);
		});

		describe('displayString', function () {

			var displayStringTest = [
				[[Datetime.makeDatetime('1m2s').getTime()], '1 minute 2 seconds'],
				[[Datetime.makeDatetime('1h2s').getTime()], '1 hour 0 minutes 2 seconds'],
				[[Datetime.makeDatetime('2m3s').getTime(), 'minute'], '2 minutes'],
				[[Datetime.makeDatetime('2m3s').getTime(), 'second', Datetime.shortPurals], '2 m 3 s'],
				[[Datetime.makeDatetime('22h13s').getTime(), 'second', Datetime.longPurals, true], '22 hours 13 seconds'],
			];

			test(Datetime.displayString, displayStringTest);
		});

		describe('shortString', function () {

			var shortStringTest = [
				[[Datetime.makeDatetime('9pm').getTime()], '21:00:00'],
				[[Datetime.makeDatetime('930pm').getTime()], '21:30:00'],
				[[Datetime.makeDatetime('93021am').getTime()], '09:30:21'],
				[[Datetime.makeDatetime('60302am6Aug2017').getTime(), Datetime.longDtFormat], '06/08/2017 06:03:02']
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

				expect(timer.now).to.within(Date.now() - 2, Date.now() + 2);
				expect(timer.start).to.within(Date.now() - 2, Date.now() + 2);
				expect(timer.end).to.equal(0);
				expect(timer.remain).to.equal(0);
				expect(timer.elapsed).to.equal(0);
				expect(timer.duration).to.equal(0);
				expect(timer.ended).to.be.true;
				expect(timer.frequency).to.equal(1000);
				expect(timer.events.end).to.be.empty;
				expect(timer.events.update).to.be.empty;

				clock.tick(2001);

				expect(timer.elapsed).equal(2000);
			});

			it('should be instantiated with end as now plus 1000ms', function () {
				var endCb = function (timer) {},
					timer = new Timer(1000, endCb);

				expect(timer.end).to.within(Date.now() + 1000 - 2, Date.now() + 1000 + 2);
				expect(timer.remain).to.equal(1000);
				expect(timer.duration).to.equal(1000);
				expect(timer.ended).to.be.false;
				expect(timer.events.end).to.include(endCb);

				clock.tick(1001);

				expect(timer.elapsed).to.equal(1000);
				expect(timer.remain).to.equal(0);
				expect(timer.ended).to.be.true;
			});

			it('should be instantiated with end 1030am6Aug2030', function () {
				var end = Datetime.makeDatetime('1030am6Aug2030'),
					endCb = function (timer) {},
					updateCb = function (timer) {},
					timer = new Timer(end, endCb, updateCb);

				expect(timer.end).to.within(end.getTime() - 2, end.getTime() + 2);
				expect(timer.remain).to.equal(end.getTime() - timer.now);
				expect(timer.duration).to.equal(end.getTime() - timer.start);
				expect(timer.ended).to.be.false;
				expect(timer.events.end).to.include(endCb);
				expect(timer.events.update).to.include(updateCb);

				clock.tick(3001);

				expect(timer.elapsed).to.equal(3000);
				expect(timer.remain).to.equal(end.getTime() - timer.now);
				expect(timer.ended).to.be.false;
			});

			it('should be instantiated with two update envent listener', function () {
				var updateCb = function (timer) {},
					updateCb2 = function (timer) {},
					timer = new Timer(null, null, updateCb, updateCb2);

				expect(timer.events.update).to.include(updateCb);
				expect(timer.events.update).to.include(updateCb2);
			});
		});

		describe('event listeners', function () {

			this.timeout(5000);

			it('should call end event listener exactly once after 2000ms', function () {
				var endCbStub = sinon.stub(),
					timer = new Timer(2000, endCbStub);

				clock.tick(4999);

				expect(endCbStub).to.be.calledOnce;
				expect(endCbStub.firstCall.args[0].ended).to.be.true;
			});

			it('should call update event listener every 1000ms', function () {
				var updateCbStub = sinon.stub(),
					timer = new Timer(null, null, updateCbStub);

				clock.tick(4999);

				expect(updateCbStub.callCount).to.equal(5);
			});

			it('should call all update event listeners every 1000ms', function () {
				var updateCbStub = sinon.stub(),
					updateCb2Stub = sinon.stub(),
					timer = new Timer(null, null, updateCbStub, updateCb2Stub);

				clock.tick(4999);

				expect(updateCbStub.callCount).to.equal(5);
				expect(updateCb2Stub.callCount).to.equal(5);
			});
		});

		describe('destroy', function () {

			it('should not call end event listener after destroy', function () {
				var endCbStub = sinon.stub(),
					timer = new Timer(2000, endCbStub);

				timer.destroy();

				expect(timer.timeout).to.be.not.ok;

				clock.tick(4999);

				expect(endCbStub).to.not.be.called;
			});

			it('should not call update event listener after destroy', function () {
				var updateCbStub = sinon.stub(),
					timer = new Timer(null, null, updateCbStub);

				timer.destroy();

				expect(timer.timeout).to.be.not.ok;

				clock.tick(4999);

				expect(updateCbStub).to.be.calledOnce
			});
		});
	});

	describe('app', function () {

		describe('dispatch', function () {

			var countUpStub,
				countToStub,
				hashErrorStub,
				clearAllStub,
				oldTimerStub;

			beforeEach(function () {
				countUpStub = sinon.stub(app, 'countUp');
				countToStub = sinon.stub(app, 'countTo');
				hashErrorStub = sinon.stub(app, 'hashError');
				clearAllStub = sinon.stub(app, 'clearAll');
				oldTimerStub = sinon.createStubInstance(Timer);
				app.timer = oldTimerStub;
			});

			afterEach(function () {
				countUpStub.restore();
				countToStub.restore();
				hashErrorStub.restore();
				clearAllStub.restore();
				delete app.timer;
			});

			it('should destroy existing timer', function () {
				app.dispatch('');

				expect(oldTimerStub.destroy).to.be.calledOnce;
				expect(oldTimerStub.destroy.firstCall.args).to.be.empty;
			});

			it('should dispatch to countUp', function () {
				app.dispatch('');

				expect(oldTimerStub.destroy).to.be.calledOnce;
				expect(oldTimerStub.destroy.firstCall.args).to.be.empty;

				expect(countUpStub).to.be.calledOnce;
				expect(countUpStub.firstCall.args).to.be.empty;
			});

			it('should dispatch to countTo with dhms', function () {
				app.dispatch('1m2s');

				expect(oldTimerStub.destroy).to.be.calledOnce;
				expect(oldTimerStub.destroy.firstCall.args).to.be.empty;

				expect(countToStub).to.be.calledOnce;
				expect(countToStub.firstCall).to.be.calledWith('1m2s');
			});

			it('should dispatch to countTo with dt', function () {
				app.dispatch('630am8Aug2014');

				expect(oldTimerStub.destroy).to.be.calledOnce;
				expect(oldTimerStub.destroy.firstCall.args).to.be.empty;

				expect(countToStub).to.be.calledOnce;
				expect(countToStub.firstCall).to.be.calledWith('630am8Aug2014');
			});

			it('should dispatch to countTo with count', function () {
				app.dispatch('5');

				expect(oldTimerStub.destroy).to.be.calledOnce;
				expect(oldTimerStub.destroy.firstCall.args).to.be.empty;

				expect(countToStub).to.be.calledOnce;
				expect(countToStub.firstCall).to.be.calledWith('5');
			});

			it('should dispatch to hashError', function () {
				app.dispatch('nonsense');

				expect(oldTimerStub.destroy).to.be.calledOnce;
				expect(oldTimerStub.destroy.firstCall.args).to.be.empty;

				expect(hashErrorStub).to.have.be.calledOnce;
				expect(hashErrorStub).to.be.calledWith('nonsense');
			});
		});
	});
});
