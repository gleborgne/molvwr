var __global = this;

module Molvwr {
	export interface IAtom {
		kind: Elements.IPeriodicElement,
		x: number,
		y: number,
		z: number,
	}

	export interface IAtomBinding {
		key: string;
		d: number;
		atomA: IAtom;
		atomB: IAtom;
	}

	export interface IMolecule {
		atoms: IAtom[];
		bonds: IAtomBinding[];
		kinds: any;
		bondkinds: any;
		batchSize: number;
	}

	export interface IMoleculeRenderer {
		render(molecule: any): Molvwr.Utils.Promise;
	}

	export function process() {
		if (!__global.BABYLON) {
			console.error("Babylon.js is not available, please add a reference to Babylon.js script");
			return;
		}

		var elements;
		if (arguments[0]) {
			if (arguments[0].length) {
				elements = arguments[0];
			} else {
				elements = [arguments[0]];
			}
		} else {
			elements = document.querySelectorAll("*[data-molvwr]");
		}

		for (var i = 0, l = elements.length; i < l; i++) {
			var e = <HTMLElement>elements[i];
			if (e && e.style) {
				if ((<any>e).molvwr) {
					(<any>e).molvwr.dispose();
				}
				var moleculeUrl = e.getAttribute("data-molvwr");
				var format = e.getAttribute("data-molvwr-format");
				var view = e.getAttribute("data-molvwr-view");

				if (!format) {
					format = Viewer.getMoleculeFileFormat(moleculeUrl);
				}
				if (!moleculeUrl) {
					console.error("please specify a molecule url by adding a data-molvwr attribute");
					return;
				}

				if (!format) {
					console.error("molecule file format not found or not specified for " + moleculeUrl);
					return;
				}

				var options = null;

				if (view == "spheres") {
					options = Molvwr.Config.spheres();
				}
				else if (view == "ballsandsticks") {
					options = Molvwr.Config.ballsAndSticks();
				} else if (view == "sticks") {
					options = Molvwr.Config.sticks();
				}

				if (moleculeUrl && format) {
					var viewer = new Viewer(e, options);
					viewer.loadContentFromUrl(moleculeUrl, format);
				}
			}
		}
	}

	export class Viewer {
		element: HTMLElement;
		canvas: HTMLCanvasElement;
		config: Molvwr.Config.IMolvwrConfig;
		viewmode: IViewMode;
		context: BabylonContext;
		molecule: IMolecule;

		constructor(element: HTMLElement, config?: Molvwr.Config.IMolvwrConfig, viewmode?: IViewMode) {
			if (!__global.BABYLON) {
				throw new Error("Babylon.js is not available, please add a reference to Babylon.js script");
			}
			if (!element)
				throw new Error("you must provide an element to host the viewer")
			this.config = config || Molvwr.Config.defaultConfig();
			this.element = element;
			(<any>this.element).molvwr = this;
			this.canvas = <HTMLCanvasElement>document.createElement("CANVAS");
			this.canvas.setAttribute("touch-action", "manipulation");
			this.canvas.style.width = "100%";
			this.canvas.style.height = "100%";
			this.element.appendChild(this.canvas);
			this.context = new BabylonContext(this.canvas);
			this.viewmode = viewmode;

			if (!this.viewmode) {
				this.viewmode = new Molvwr.ViewModes.Standard();
			}
		}

		dispose() {
			this.context.dispose();
			this.context = null;
			this.element = null;
			this.canvas = null;
			this.element.innerHTML = "";
		}

		private _loadContentFromString(content: string, contentFormat: string) : Molvwr.Utils.Promise {
			return new Molvwr.Utils.Promise((complete, error) => {
				var parser = Molvwr.Parser[contentFormat];
				if (parser) {
					var molecule = parser.parse(content);
					if (molecule) {
						this._postProcessMolecule(molecule).then(() => {
							return this._renderMolecule(molecule);
						}).then(complete, error);
					} else {
						console.warn("no molecule from parser " + contentFormat);
						complete();
					}
				} else {
					console.warn("no parser for " + contentFormat);
					complete();
				}
			});
		}

		private _renderMolecule(molecule: IMolecule): Molvwr.Utils.Promise {
			this.molecule = molecule;
			this._createContext();

			return new Molvwr.Utils.Promise((complete, error) => {
				if (this.config.renderers) {
					var completedCount = 0;
					var nbrenderers = this.config.renderers.length;

					var p = [];
					this.config.renderers.forEach((rendererName) => {
						var rendererClass = Molvwr.Renderer[rendererName];
						if (rendererClass) {
							var renderer = <IMoleculeRenderer>new rendererClass(this, this.context, this.config);
							p.push(renderer.render(this.molecule));
						}
					});

					Molvwr.Utils.Promise.all(p).then(complete, error);
				} else {
					complete();
				}
			});
		}

		setOptions(options, completedcallback?) {
			this.config = options;
			this.refresh(completedcallback);
		}

		setViewMode(viewmode: IViewMode, completedcallback?) {
			this.viewmode = viewmode;
			if (!this.viewmode) {
				this.viewmode = new Molvwr.ViewModes.Standard();
			}
			this.refresh(completedcallback);
		}

		refresh(completedcallback) {
			if (this.molecule) {
				this._renderMolecule(this.molecule).then(completedcallback, completedcallback);
			} else {
				if (completedcallback) completedcallback();
			}
		}

		private _createContext() {
			if (this.context)
				this.context.dispose();
			this.context = new BabylonContext(this.canvas);
			this.context.viewmode = this.viewmode;
			this.context.createScene();
		}

		exportScreenshot() {
			return this.context.exportScreenshot();
		}

		static endsWith(str, suffix) {
			return str.indexOf(suffix, str.length - suffix.length) !== -1;
		};

		static getMoleculeFileFormat(filename: string): string {
			if (Viewer.endsWith(filename, ".pdb"))
				return "pdb";
			if (Viewer.endsWith(filename, ".mol") || Viewer.endsWith(filename, ".sdf"))
				return "mol";
			if (Viewer.endsWith(filename, ".xyz"))
				return "xyz";

			return null;
		}

		loadContentFromString(content: string, contentFormat: string, completedcallback?) {
			this._createContext();
			this._loadContentFromString(content, contentFormat).then(completedcallback, completedcallback);
		}

		loadContentFromUrl(url: string, contentFormat?: string, completedcallback?) {
			if (!contentFormat) {
				contentFormat = Viewer.getMoleculeFileFormat(url);
			}

			if (!contentFormat) {
				console.error("molecule file format not found or not specified");
			}

			this._createContext();
			try {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            this._loadContentFromString(xhr.responseText, contentFormat).then(completedcallback, completedcallback);
                        }
                        else {
							console.warn("cannot get content from " + url + " " + xhr.status + " " + xhr.statusText);
							completedcallback();
                        }
                    }
                };

                xhr.open("GET", url, true);
                xhr.send(null);
            } catch (e) {
                console.error(e);
				completedcallback();
            }
		}


		private _postProcessMolecule(molecule: IMolecule) : Molvwr.Utils.Promise {
			console.time("post process");
			molecule.kinds = molecule.kinds || {};
			molecule.bondkinds = molecule.bondkinds || {};
			
			molecule.batchSize = Math.min(50, (molecule.atoms.length / 4) >> 0);
			molecule.batchSize = Math.max(20, molecule.batchSize);
			
			return this._center(molecule).then(()=>{
				return this._calculateAtomsBondsAsync(molecule);
			}).then(() => {
				console.timeEnd("post process");
			});
		}
		
		private _calculateAtomsBondsAsync(molecule : IMolecule) {
			console.time("check bounds");
			var bonds = [];
			var nbatoms = molecule.atoms.length;
			return Molvwr.Utils.runBatch(0, 200, molecule.atoms, (atom, batchindex, index) => {
				//console.log("check " + atom.kind.symbol + " " + index + " " + bonds.length);
				if (!molecule.kinds[atom.kind.symbol]) {
					molecule.kinds[atom.kind.symbol] = { kind: atom.kind };
				}

				for (var i = index + 1; i < nbatoms; i++) {
					var siblingAtom = molecule.atoms[i];
					var l = new BABYLON.Vector3(atom.x, atom.y, atom.z);
					var m = new BABYLON.Vector3(siblingAtom.x, siblingAtom.y, siblingAtom.z);
					var d = BABYLON.Vector3.Distance(l, m);

					if (d < 1.3 * (atom.kind.radius + siblingAtom.kind.radius)) {
						if (!molecule.bondkinds[atom.kind.symbol + "#" + siblingAtom.kind.symbol]) {
							molecule.bondkinds[atom.kind.symbol + "#" + siblingAtom.kind.symbol] = { d: d, key: atom.kind.symbol + "#" + siblingAtom.kind.symbol, kindA: atom.kind, kindB: siblingAtom.kind };
						}

						bonds.push({
							d: d,
							atomA: atom,
							atomB: siblingAtom,
							cutoff: d / (atom.kind.radius + siblingAtom.kind.radius)
						});
					}
				}
			}, "checkbounds").then(() => {
				molecule.bonds = bonds;
				console.timeEnd("check bounds");
				console.log("found " + bonds.length + " bonds");
			});
		}

		private _getCentroid(molecule : IMolecule) {
			var minX = Infinity, maxX = -Infinity,
				minY = Infinity, maxY = -Infinity,
				minZ = Infinity, maxZ = -Infinity;

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
				x: (minX + maxX) / 2,
				y: (minY + maxY) / 2,
				z: (minZ + maxZ) / 2,
			}
		}

		private _center(molecule : IMolecule) {
			console.time("recenter atoms");
			var shift = this._getCentroid(molecule);

			molecule.atoms.forEach(function(atom) {
				atom.x -= shift.x;
				atom.y -= shift.y;
				atom.z -= shift.z;
			});
			console.timeEnd("recenter atoms");
			return Molvwr.Utils.Promise.resolve();
		}

	}
}