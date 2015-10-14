module Molvwr.Parser {
	function getFloat(s) {
		if (!s)
			return 0;

		return parseFloat(s.trim())
	}

	export var mol = {
		parse: function(content: string) {
			console.log("parsing mol content");
			//console.log(content);

			var molecule = {
				atoms: [],
				title: null
			};

			var lines = content.split('\n');
			molecule.title = lines[1];
			
			for (var i = 0, l = lines.length; i < l; i++) {
				if (lines[i].indexOf("  ") == 0) {
					var lineElements = lines[i].split(" ").filter((s) => {
						var tmp = s.trim();
						if (tmp && tmp.length)
							return true;
						else
							return false;
					});

					if (lineElements.length && lineElements.length >= 4) {
						var symbol = lineElements[3].trim();
						var x = getFloat(lineElements[0]);
						var y = getFloat(lineElements[1]);
						var z = getFloat(lineElements[2]);

						var atomKind = Molvwr.Elements.elementsBySymbol[symbol];
						if (atomKind) {
							console.log("found atom " + atomKind.name + " " + x + "," + y + "," + z);
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
			console.log("found " + molecule.atoms.length);
			return molecule;
		}
	}
}