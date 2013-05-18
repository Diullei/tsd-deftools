///<reference path="../_ref.ts" />
///<reference path="lib.ts" />
///<reference path="exporter.ts" />
///<reference path="importer.ts" />
///<reference path="comparer.ts" />
///<reference path="parser.ts" />

module tsdimport {

	var fs = require('fs');
	var path = require('path');
	var util = require('util');
	var async:Async = require('async');
	var _:UnderscoreStatic = require('underscore');

	export class Expose {

		_commands:any = {};

		constructor() {
			this.add('help', () => {
				console.log('availible commands:');
				_(this._commands).keys().sort().forEach((value) => {
					console.log('  - ' + value);
				});
			});
			this.map('h', 'help');
		}

		add(id:string, def:Function) {
			if (this._commands.hasOwnProperty(id)) {
				throw new Error('id collission on ' + id);
			}
			this._commands[id] = def;
		}

		map(id:string, to:string) {
			var self = this;
			this.add(id, () => {
				self.execute(to, false);
			});
		}

		execute(id:string, head:bool = true) {
			if (!this._commands.hasOwnProperty(id)) {
				console.log('nothing exposed as ' + id);
				return;
			}
			if (head) {
				console.log('-> execute ' + id);
			}
			var f = this._commands[id];
			f.call(null);
		}
	}
}