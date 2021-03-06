///<reference path="../_ref.ts" />
///<reference path="lib.ts" />

module tsdimport {

	var fs = require('fs');
	var path = require('path');
	var util = require('util');
	var async:Async = require('async');
	var _:UnderscoreStatic = require('underscore');

	var stripExt = /(\.[\w_-]+)$/;
	var ignoreFile = /^[\._]/;
	var isJson = /\.json$/;
	var isDef = /\.d\.ts$/;

	export module loader {

		export function loadRepoDefList(repos:Repos, finish:(err, res:Def[]) => void) {
			fs.readdir(repos.defs, (err, files:string[]) => {
				if (err) return finish(err, []);

				var ret:Def[] = [];

				//check if these are folders containing a definition
				async.forEach(files, (file, callback:(err) => void) => {
					if (ignoreFile.test(file)) {
						return callback(false);
					}

					var src = path.join(repos.defs, file);

					fs.stat(src, (err, stats) => {
						if (err) return callback(false);
						if (!stats.isDirectory()) {
							return callback(false);
						}
						fs.readdir(src, (err, files:string[]) => {
							if (err) return callback(false);

							files = _(files).filter((name) => {
								return isDef.test(name);
							});

							async.forEach(files, (name, callback:(err) => void) => {
								//src + '/' + file + '/' + sub;
								var tmp = path.join(src, name);
								fs.stat(tmp, (err, stats) => {
									if (err) return callback(false);
									if (stats.isDirectory()) {
										return callback(false);
									}
									//console.log('-> ' + sub);
									ret.push(new Def(file, name.replace(isDef, '')));
									callback(null);
								});
							}, (err) => {
								callback(err);
							});
						});
					});

				}, (err) => {
					finish(err, ret);
				});
			});
		}

		export function loadTsdList(repos:Repos, finish:(err, res:string[]) => void) {
			fs.readdir(repos.tsd + 'repo_data', (err, files:string[]) => {
				if (err) return finish(err, []);

				finish(null, _(files).filter((value) => {
					return !ignoreFile.test(value) && isJson.test(value);
				}).map((value) => {
					return value.replace(stripExt, '');
				}));
			});
		}
	}
}