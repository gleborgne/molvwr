module Molvwr {
	export class Viewer {
		element: HTMLElement;
		canvas: HTMLCanvasElement;
		config: Molvwr.Config.IMolvwrConfig;
		context: BabylonContext;
		molecule: any;

		constructor(element: HTMLElement, config?: Molvwr.Config.IMolvwrConfig) {
			if (!element)
				throw new Error("you must provide an element to host the viewer")
			this.config = config || Molvwr.Config.defaultConfig();
			this.element = element;
			this.canvas = <HTMLCanvasElement>document.createElement("CANVAS");
			this.canvas.setAttribute("touch-action", "manipulation");
			this.element.appendChild(this.canvas);
			this.context = new BabylonContext(this.canvas);

		}

		private _loadContentFromString(content: string, contentFormat: string) {
			var parser = Molvwr.Parser[contentFormat];
			if (parser) {
				var molecule = parser.parse(content);
				if (molecule) {
					this._postProcessMolecule(molecule);

					this.renderMolecule(molecule);
				} else {
					console.warn("no molecule from parser " + contentFormat);
				}
			} else {
				console.warn("no parser for " + contentFormat);
			}
		}

		renderMolecule(molecule) {
			this.molecule = molecule;
			this.createContext();
			setTimeout(() => {
				if (this.config.renderers) {
					this.config.renderers.forEach((rendererName) => {
						var rendererClass = Molvwr.Renderer[rendererName];
						if (rendererClass) {
							var renderer = new rendererClass(this, this.context, this.config);
							renderer.render(this.molecule);
						} else {
							console.warn("no renderer for " + rendererName);
						}
					});
				}
			}, 50);
		}

		setOptions(options) {
			this.config = options;
			if (this.molecule) {
				this.renderMolecule(this.molecule);
			}
		}

		createContext() {
			if (this.context)
				this.context.dispose();
			this.context = new BabylonContext(this.canvas);
			this.context.createScene();
		}

		loadContentFromString(content: string, contentFormat: string) {
			this.createContext();
			this._loadContentFromString(content, contentFormat);
		}

		loadContentFromUrl(url: string, contentFormat: string) {
			this.createContext();
			try {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            this._loadContentFromString(xhr.responseText, contentFormat);
                        }
                        else {
							console.warn("cannot get content from " + url + " " + xhr.status + " " + xhr.statusText);
                        }
                    }
                };

                xhr.open("GET", url, true);
                xhr.send(null);
            } catch (e) {
                console.error(e);
            }
		}

		private _postProcessMolecule(molecule) {
			this._center(molecule);
			this._calculateAtomsBonds(molecule);
		}

		private _calculateAtomsBonds(molecule) {
			console.time("check bounds");
			var bonds = [];
			var nbatoms = molecule.atoms.length;
			molecule.atoms.forEach(function(atom, index) {

				for (var i = index + 1; i < nbatoms; i++) {
					var siblingAtom = molecule.atoms[i];
					var l = new BABYLON.Vector3(atom.x, atom.y, atom.z);
					var m = new BABYLON.Vector3(siblingAtom.x, siblingAtom.y, siblingAtom.z);
					var d = BABYLON.Vector3.Distance(l, m);

					if (d < 1.3 * (atom.kind.radius + siblingAtom.kind.radius)) {
						bonds.push({
							d: d,
							atomA: atom,
							atomB: siblingAtom,
							cutoff: d / (atom.kind.radius + siblingAtom.kind.radius)
						});
					}
				}
			});
			molecule.bonds = bonds;
			console.timeEnd("check bounds");
			console.log("found " + bonds.length + " bonds");
		}

		private _getCentroid(molecule) {
			var minX=Infinity,maxX=-Infinity,
				minY=Infinity,maxY=-Infinity,
				minZ=Infinity,maxZ=-Infinity;
				
			molecule.atoms.forEach(function(atom) {
				if (atom.x > maxX)
					maxX = atom.x;
				if (atom.x < minX)
					minX = atom.x;
					
				if (atom.y > maxY)
					maxY = atom.y;
				if (atom.y < minY)
					minY = atom.y;
					
				if (atom.z > maxZ)
					maxZ = atom.z;
				if (atom.z < minZ)
					minZ = atom.z;
			});
			
			return {
				x : (minX + maxX)/2,
				y : (minY + maxY)/2,
				z : (minZ + maxZ)/2,
			}
		}

		private _center(molecule) {
			var shift = this._getCentroid(molecule);
			
			molecule.atoms.forEach(function(atom) {
				atom.x -= shift.x;
				atom.y -= shift.y;
				atom.z -= shift.z;
				
				console.log(atom.kind.symbol + " " + atom.x + "," + atom.y + "," + atom.z);
			});									
		}

	}
}