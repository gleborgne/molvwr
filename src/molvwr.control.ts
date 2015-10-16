var __global = this;

module Molvwr {
	export function process(){
		if (!__global.BABYLON){
			console.error("Babylon.js is not present, please add a reference to Babylon.js script");
			return;
		}
		
		var elements;
		if (arguments[0]){
			if (arguments[0].length){
				elements = arguments[0];
			}else{
				elements = [arguments[0]];
			}
		}else{
			elements = document.querySelectorAll("*[data-molvwr]");
		}
		
		for (var i=0, l=elements.length; i<l ; i++){
			var e= <HTMLElement>elements[i];
			if (e && e.style){
				if ((<any>e).molvwr){
					(<any>e).molvwr.dispose();
				}
				var moleculeUrl = e.getAttribute("data-molvwr");
				var format = e.getAttribute("data-molvwr-format");
				var view = e.getAttribute("data-molvwr-view");
				
				if (!format){
					format = Viewer.getMoleculeFileFormat(moleculeUrl);
				}
				if (!moleculeUrl){
					console.error("please specify a molecule url by adding a data-molvwr attribute");
					return;
				}
				
				if (!format){
					console.error("molecule file format not found or not specified for " + moleculeUrl);
					return;
				}
				
				var options = null;
				if (view == "spheres"){
					options = Molvwr.Config.spheres();
				}
				else if (view == "ballsandsticks"){
					options = Molvwr.Config.ballsAndSticks();
				}
				if (moleculeUrl && format){
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
		context: BabylonContext;
		molecule: any;

		constructor(element: HTMLElement, config?: Molvwr.Config.IMolvwrConfig) {
			if (!__global.BABYLON){
				throw new Error("Babylon.js is not present, please add a reference to Babylon.js script");
			}
			if (!element)
				throw new Error("you must provide an element to host the viewer")
			this.config = config || Molvwr.Config.defaultConfig();
			this.element = element;
			(<any>this.element).molvwr = this;
			this.canvas = <HTMLCanvasElement>document.createElement("CANVAS");
			this.canvas.setAttribute("touch-action", "manipulation");
			this.canvas.style.width= "100%";
			this.canvas.style.height= "100%";
			this.element.appendChild(this.canvas);
			this.context = new BabylonContext(this.canvas);
		}
		
		dispose(){
			this.context.dispose();
			this.context = null;
			this.element = null;
			this.canvas = null;
			this.element.innerHTML = "";
		}

		private _loadContentFromString(content: string, contentFormat: string, completedcallback) {
			var parser = Molvwr.Parser[contentFormat];
			if (parser) {
				var molecule = parser.parse(content);
				if (molecule) {
					this._postProcessMolecule(molecule);

					this._renderMolecule(molecule, completedcallback);
				} else {
					console.warn("no molecule from parser " + contentFormat);
				}
			} else {
				console.warn("no parser for " + contentFormat);
			}
		}

		private _renderMolecule(molecule, completedcallback) {
			this.molecule = molecule;
			this._createContext();
			setTimeout(() => {
				if (this.config.renderers) {
					var completedCount = 0;
					var nbrenderers = this.config.renderers.length;
					var incCompleted = function(){
						completedCount++;
						
						if (completedCount == nbrenderers){
							console.log("render complete");
							if (completedcallback)
								completedcallback();
						}
					}
					
					this.config.renderers.forEach((rendererName) => {
						var rendererClass = Molvwr.Renderer[rendererName];
						if (rendererClass) {
							var renderer = new rendererClass(this, this.context, this.config);
							renderer.render(this.molecule, function(){
								incCompleted();
							});
						} else {
							incCompleted();
							console.warn("no renderer for " + rendererName);
						}
					});
				}
			}, 50);
		}

		setOptions(options, completedcallback?) {
			this.config = options;
			if (this.molecule) {
				this._renderMolecule(this.molecule, completedcallback);
			}
		}
		
		setViewMode(viewmode : IViewMode, completedcallback?) {
			this.context.viewMode = viewmode;
			if (this.molecule) {
				this._renderMolecule(this.molecule, completedcallback);
			}
		}

		private _createContext() {
			if (this.context)
				this.context.dispose();
			this.context = new BabylonContext(this.canvas);
			this.context.createScene();
		}

		exportScreenshot(){
			return this.context.exportScreenshot();
		}
		
		static endsWith(str, suffix) {
			return str.indexOf(suffix, str.length - suffix.length) !== -1;
		};

		static getMoleculeFileFormat(filename : string): string {
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
			this._loadContentFromString(content, contentFormat, completedcallback);
		}

		loadContentFromUrl(url: string, contentFormat?: string, completedcallback?) {
			if (!contentFormat){
				contentFormat = Viewer.getMoleculeFileFormat(url);
			}
			
			if (!contentFormat){
				console.error("molecule file format not found or not specified");
			}
			
			this._createContext();
			try {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            this._loadContentFromString(xhr.responseText, contentFormat, completedcallback);
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


		private _postProcessMolecule(molecule) {
			molecule.batchSize = Math.min(50, (molecule.atoms.length / 4) >> 0);
			this._center(molecule);
			this._calculateAtomsBonds(molecule);
		}

		private _calculateAtomsBonds(molecule) {
			console.time("check bounds");
			var bonds = [];
			var nbatoms = molecule.atoms.length;
			
			molecule.kinds = molecule.kinds || {};
			molecule.bondkinds = molecule.bondkinds || {};
			
			molecule.atoms.forEach(function(atom, index) {
				
				if (!molecule.kinds[atom.kind.symbol]){
					molecule.kinds[atom.kind.symbol] = { kind : atom.kind};
				}
				
				for (var i = index + 1; i < nbatoms; i++) {
					var siblingAtom = molecule.atoms[i];
					var l = new BABYLON.Vector3(atom.x, atom.y, atom.z);
					var m = new BABYLON.Vector3(siblingAtom.x, siblingAtom.y, siblingAtom.z);
					var d = BABYLON.Vector3.Distance(l, m);

					if (d < 1.3 * (atom.kind.radius + siblingAtom.kind.radius)) {
						if (!molecule.bondkinds[atom.kind.symbol + "#" + siblingAtom.kind.symbol]){
							molecule.bondkinds[atom.kind.symbol + "#" + siblingAtom.kind.symbol] = { d: d, key : atom.kind.symbol + "#" + siblingAtom.kind.symbol, kindA : atom.kind, kindB : siblingAtom.kind};
						}		
						
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