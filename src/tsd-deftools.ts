///<reference path="_ref.ts" />
///<reference path="core/api.ts" />
///<reference path="core/lib.ts" />
///<reference path="core/config.ts" />
///<reference path="core/expose.ts" />

module tsdimport {

	var fs = require('fs');
	var path = require('path');
	var util = require('util');
	var async:Async = require('async');
	var _:UnderscoreStatic = require('underscore');
	//var agent:SuperAgent = require('superagent');

	var info = Config.getInfo();
	var paths = Config.getPaths();
	var app:AppAPI = new AppAPI(info, new Repos(paths.DefinitelyTyped, paths.tsd, paths.tmp));

	//expose some easy access tools to cli
	var expose = new Expose();
	expose.add('info', () => {
		console.log(info.getNameVersion());
		_(app.repos).keys().sort().forEach((value) => {
			console.log('   ' + value + ': ' + app.repos[value]);
		});
	})

	expose.add('compare', () => {
		app.compare((err?, res?:CompareResult) => {
			if (err) return console.log(err);
			console.log(res);
			console.log(res.getStats());
		});
	})

	/*expose.add('createUnlisted', () => {
		app.createUnlisted((err?, res?:ExportResult) => {
			if (err) return console.log(err);
			console.log(res);
		});
	})

	expose.add('parseCurrent', () => {
		app.parseCurrent((err?, res?:CompareResult) => {
			if (err) return console.log(err);
			console.log(res);
		});
	});*/

	//kill this when included
	var argv = require('optimist').argv;
	expose.execute('info');

	if (argv._.length == 0) {
		expose.execute('help');
	} else {
		expose.execute(argv._[0]);
		if (!expose.has(argv._[0])) {
			expose.execute('help');
		}
	}
	//expose.execute('compare');
}
//kill this when in cli mode
//exports = (module).exports = tsdimport;
