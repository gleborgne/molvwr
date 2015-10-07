module Molvwr.Parser {
	function getFloat(s){
		return parseFloat(s.trim())
	}
	
	export var xyz = {
		parse : function(content: string){
			console.log("parsing xyz content");
//			console.log(content);
			
			var molecule = {
				atoms : [],
				title : null 
			};
			
			var lines = content.split("\n");
			molecule.title = lines[1];
			
			for (var i=2, l=lines.length ; i<l ; i++){
				var lineElements = lines[i].split(" ").filter((s) => {
					var tmp = s.trim();
					if (tmp)
						return true;
				});
				if (lineElements.length){
					var symbol = lineElements[0].trim();
					var x = getFloat(lineElements[1]);
					var y = getFloat(lineElements[2]);
					var z = getFloat(lineElements[3]);
					
					var atomKind = Molvwr.Elements.elementsBySymbol[lineElements[0].trim()];
					//console.log("found atom " + atomKind.name + " " + x + "," + y + "," + z);
					molecule.atoms.push({
						symbol : atomKind.symbol,
						number : atomKind.number,
						x : x,
						y: y,
						z: z,
						bonds : []
					})
				}
			}
			console.log("found " + molecule.title + " " + molecule.atoms.length);
			return molecule;
		}
	}
}