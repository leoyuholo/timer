(function () {
	var root = this;

	var app = function () {

	};

	app.getHash = function () {
		var hash = window.location.hash;

		return hash ? hash.slice(1) : '';
	};

	app.dtFormat = Datetime.shortDtFormat;
	app.purals = Datetime.longPurals;
	app.precision = 'second';

	app.displayString = function (time, skipZero) {
		return Datetime.displayString(time, app.precision, app.purals, skipZero);
	};

	app.shortString = function (time) {
		return Datetime.shortString(time, app.dtFormat);
	};

	// responsive layout or timer over one day
	app.updateFormat = function () {
		var needUpdateDisplay = false,
			needUpdateShort = false;

		var setDtFormat = function (newFormat) {
			if (app.dtFormat !== newFormat) {
				needUpdateShort = true;
				app.dtFormat = newFormat
			}
		};

		var setPurals = function (newPurals) {
			if (app.purals !== newPurals) {
				needUpdateDisplay = true;
				app.purals = newPurals;
			}
		};

		if (app.timer && app.timer.overDays) {
			setDtFormat(Datetime.longDtFormat);
		} else {
			setDtFormat(Datetime.shortDtFormat);
		}

		if ($(window).width() <= 600) {
			setPurals(Datetime.shortPurals);
		} else {
			setPurals(Datetime.longPurals);
		}

		if (needUpdateDisplay && app.timer) {
			app.updateElapsed(app.timer);
			app.updateRemain(app.timer);
			app.updateDuration(app.timer);
		}

		if (needUpdateShort && app.timer) {
			app.updateNow(app.timer);
			app.updateStart(app.timer);
			app.updateEnd(app.timer);
		}
	};

	app.updateTitle = function (timer) {
		document.title = $('#timer').text();
	};

	app.updateNow = function (timer) {
		$('.now-text').text(app.shortString(timer.now));
	};

	app.updateElapsed = function (timer) {
		if (!timer.overDays && timer.elapsed >= Datetime.dayCount) {
			timer.overDays = true;
			app.updateFormat(timer);
		}

		$('.elapsed-text').text(app.displayString(timer.elapsed));
		app.updateTitle(timer);
	};

	app.updateRemain = function (timer) {
		$('.remain-text').text(app.displayString(timer.remain));
		app.updateTitle(timer);
	};

	app.updateStart = function (timer) {
		$('.start-text').text(app.shortString(timer.start));
	};

	app.updateDuration = function (timer) {
		$('.duration-text').text(app.displayString(timer.duration, true));
	};

	app.updateEnd = function (timer) {
		$('.end-text').text(app.shortString(timer.end));
	};

	app.elapsedTextHtml = '<div class="elapsed-text timer"></div>';
	app.remainTextHtml = '<div class="remain-text timer"></div>';
	app.startTextHtml = '<div class="start-text datetime"></div>';
	app.durationTextHtml = '<div class="duration-text timer"></div>';
	app.endTextHtml = '<div class="end-text datetime"></div>';

	app.countUp = function () {
		$('#timer').html(app.elapsedTextHtml + ' elapsed');
		$('#remarks-1').html('started counting at ' + app.startTextHtml);

		app.timer = new Timer(null, null, app.updateNow, app.updateElapsed);

		app.updateStart(app.timer);
	};

	app.countTo = function (hash) {
		$('#timer').html(app.remainTextHtml + ' remains');
		$('#remarks-1').html('started waiting at ' + app.startTextHtml + ' for ' + app.durationTextHtml + ' until ' + app.endTextHtml);

		var countTo = Datetime.makeDatetime(hash);
		if (!Datetime.isDt(hash)) {
			countTo = countTo.getTime();
		}

		app.timer = new Timer(countTo, app.finishCountTo, app.updateNow, app.updateRemain);

		if (app.timer.duration > Datetime.dayCount) {
			app.timer.overDays = true;
		}

		app.updateFormat();

		app.updateStart(app.timer);
		app.updateDuration(app.timer);
		app.updateEnd(app.timer);
	};

	app.hashError = function (hash) {
		$('#timer').html('<div class="error">Ooops! <div class="hash">' + hash + '</div> looks unfamiliar! :(</div>');

		app.timer = new Timer(null, null, app.updateNow);
	};

	app.finishCountTo = function (timer) {
		$('#timer').html(app.durationTextHtml + ' passed');
		$('#remarks-2').html('You are now ' + app.remainTextHtml + ' late.');

		app.updateDuration(timer);
		app.updateRemain(timer);

		$('body').addClass('alarm');
	};

	app.clearAll = function () {
		$('#timer').html('');
		$('#remarks-1').html('');
		$('#remarks-2').html('');

		app.updateFormat();

		$('body').removeClass('alarm');

		document.title = 'Timer';
	};

	app.dispatch = function (hash) {
		if (app.timer)
			app.timer.destroy();

		app.clearAll();

		if (!hash) {
			app.countUp();
		} else if (Datetime.isParsable(hash)) {
			app.countTo(hash);
		} else {
			app.hashError(hash);
		}
	};

	app.main = function () {

		window.onhashchange = function () {
			app.dispatch(app.getHash());
		};

		var lastWidth = $(window).width();
		$(window).resize(function () {
			var width = $(window).width();
			if ((lastWidth > 600 && width <= 600) || (lastWidth <= 600 && width > 600)) {
				lastWidth = width;
				app.updateFormat();
			}
		});

		app.dispatch(app.getHash());
	};

	root.app = app;
}.call(this));