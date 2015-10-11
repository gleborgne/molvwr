//see http://www.wwpdb.org/documentation/file-format-content/format33/sect9.html#ANISOU for reference
module Molvwr.Parser {
	function getFloat(s) {
		if (!s)
			return 0;

		return parseFloat(s.trim())
	}

	export var pdb = {
		parse: function(content: string) {
			console.log("parsing pdb content");
			//console.log(content);

			var molecule = {
				atoms: [],
				title: null
			};

			var lines = content.split('\n');

			for (var i = 0, l = lines.length; i < l; i++) {
				var line = lines[i];
				if (line.indexOf("HETATM") == 0 || line.indexOf("ATOM") == 0) {
					this.parseHETATM(molecule, line);
				}
			}
			console.log("found " + molecule.title + " " + molecule.atoms.length);
			return molecule;
		},

		parseHETATM(molecule, line) {
			var symbol = line.substr(12, 2).trim();
			if (isNaN(symbol[0]) === false){
				symbol = symbol.substr(1);
			}
			var atomKind = Molvwr.Elements.elementsBySymbol[symbol];
			if (atomKind) {
				var x = parseFloat(line.substr(30, 8).trim());
				var y = parseFloat(line.substr(38, 8).trim());
				var z = parseFloat(line.substr(46, 8).trim());
				console.log(symbol + " " + x + "," + y + "," + z);
				molecule.atoms.push({
					kind: atomKind,
					x: x,
					y: y,
					z: z,
					bonds: []
				});
			} else {
				console.warn("atom not found " + symbol);
			}
		}
	}
}