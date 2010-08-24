/*
---

script: Number.Extras.js

name: Number.Extras

description: Extends the Number type object to include useful methods to work with numbers.

license: MIT-style license

authors:
  - Arian Stolwijk
 
requires:
  - Core/Number
  - /Locale/Number.English.US

provides: [Number.Extras]

...
*/

(function(){

var UID = Math.floor(Math.random() * 10e12);

Number.uniqueID = function(){
	return (UID++).toString(36);
};

Number.implement({
	
	format: function(options){
		// Thanks dojo and YUI for some inspiration
		var value = this,
			locale = Object.clone(Locale.get('Number'));
		var options = Object.merge(locale, options || {});
		var negative = value < 0,
			decimal = options.decimal,
			precision = options.precision,
			group = options.group,
			decimals = options.decimals;
		
		if (negative){
			if (options.prefix) options.negative.prefix = options.prefix + options.negative.prefix;
			options = Object.merge(options, options.negative);
			value *= -1;
		}
		
		if (decimals > 0 && decimals <= 20) value = value.toFixed(decimals);
		if (precision >= 1 && precision <= 21) value = value.toPrecision(precision);
		
		value += '';

		var regex = /^(.+)e\+(\d)$/i;
		if (options.scientific === false ){
			var match = value.match(regex);
			if (match){
				value = match[1].replace('.', '');
				times = match[2] - match[1].split('.').getLast().length;
				while (times--) value += '0';
			}
		}
		
		if (decimal != '.') value = value.replace('.', decimal);
		
		if (options.group){
			var decIndex = value.lastIndexOf(decimal);
			decIndex = (decIndex > -1) ? decIndex : value.length;
			var newOutput = value.substring(decIndex),
				i = decIndex;
				
			while (i--){
				if ((decIndex - i - 1) % 3 == 0 && i != (decIndex - 1)){
					newOutput = group + newOutput;
				}
				newOutput = value.charAt(i) + newOutput;
			}

			value = newOutput;
		}
		
		if (options.prefix) value = options.prefix + value;
		if (options.suffix) value += options.suffix;
		
		return value;
	},
	
	formatCurrency: function(){
		return this.format(Locale.get('Number.currency'));
	},
	
	formatPercentage: function(){
		return this.format(Locale.get('Number.percentage'));
	}
	
});


})();