module Molvwr {
	export class Viewer {
		element: HTMLElement;
		canvas: HTMLCanvasElement;
		config: Molvwr.Config.IMolvwrConfig;
		context: BabylonContext;
		molecule : any;

		constructor(element: HTMLElement, config?: Molvwr.Config.IMolvwrConfig) {
			if (!element)
				throw new Error("you must provide an element to host the viewer")
			this.config = config || Molvwr.Config.defaultConfig();
			this.element = element;
			this.canvas = <HTMLCanvasElement>document.createElement("CANVAS");
			this.element.appendChild(this.canvas);
			this.context = new BabylonContext(this.canvas);

		}

		private _loadContentFromString(content: string, contentFormat: string) {
			var parser = Molvwr.Parser[contentFormat];
			if (parser) {
				var molecule = parser.parse(content);
				if (molecule) {
					this._postProcessMolecule(molecule);
					this.molecule = molecule;
					if (this.config.renderers) {
						this.config.renderers.forEach((rendererName) => {
							var rendererClass = Molvwr.Renderer[rendererName];
							if (rendererClass) {
								var renderer = new rendererClass(this, this.context, this.config);
								renderer.render(molecule);
							} else {
								console.warn("no renderer for " + rendererName);
							}
						});
					}
				} else {
					console.warn("no molecule from parser " + contentFormat);
				}
			} else {
				console.warn("no parser for " + contentFormat);
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
			//this._center(molecule);
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

					if (d < 1.1 * (atom.kind.radius + siblingAtom.kind.radius)) {
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

		private _getCentroid(s) {
			var xsum = 0;
			var ysum = 0;
			var zsum = 0;
			for (var i = 0; i < s.atoms.length; i++) {
				xsum += s.atoms[i].x;
				ysum += s.atoms[i].y;
				zsum += s.atoms[i].z;
			}

			return {
				x: xsum / s.atoms.length,
				y: ysum / s.atoms.length,
				z: zsum / s.atoms.length
			};
		}

		private _center(molecule) {
			var shift = this._getCentroid(molecule);
			molecule.atoms.forEach(function(atom) {
				atom.x -= shift.x;
				atom.y -= shift.y;
				atom.z -= shift.z;
			});
		}

	}
}