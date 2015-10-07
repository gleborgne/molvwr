module Molvwr {
	export class BabylonContext {
		engine: BABYLON.Engine;
		scene: BABYLON.Scene;
		canvas: HTMLCanvasElement;
		atomsMaterials: any;

		constructor(canvas) {
			this.canvas = canvas;
			this.engine = new BABYLON.Engine(canvas, true);
			this.atomsMaterials = {};
			this.engine.runRenderLoop(() => {
				if (this.scene)
					this.scene.render();
			});
		}
		
		getMaterial(atomsymbol:string){
			var existing = this.atomsMaterials[atomsymbol];
			if (existing)
				return existing;
			
			var atomKind = Molvwr.Elements.elementsBySymbol[atomsymbol];
			if (atomKind){
				var atomMat = new BABYLON.StandardMaterial('materialFor' + atomsymbol, this.scene);
				atomMat.diffuseColor = new BABYLON.Color3(atomKind.color[0], atomKind.color[1], atomKind.color[2]);
				atomMat.specularColor = new BABYLON.Color3(0.2,0.2,0.2);
				atomMat.diffuseTexture = new BABYLON.Texture('noise.png', this.scene);
				this.atomsMaterials[atomsymbol] = atomMat;
				return atomMat;
			}
		}

		createScene() {
			if (this.scene)
				this.scene.dispose();

			console.log("create babylon scene");
			
			var scene = new BABYLON.Scene(this.engine);
			scene.clearColor = new BABYLON.Color3(100, 100, 100);
			
			var camera = new BABYLON.ArcRotateCamera('Camera', 1, .8, 10, new BABYLON.Vector3(0, 0, 0), scene);
			camera.wheelPrecision = 10;
			camera.setTarget(BABYLON.Vector3.Zero());
			camera.attachControl(this.canvas, true);
		
			var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 20, 0), scene);
			light.intensity = 0.8;			

			this.scene = scene;
		}

		testScene() {
			// Our built-in 'sphere' shape. Params: name, subdivs, size, scene
			var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, this.scene);
		
			// Move the sphere upward 1/2 its height
			sphere.position.y = 1;
		
			// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
			var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, this.scene);

		}
	}

	export class Viewer {
		element: HTMLElement;
		canvas: HTMLCanvasElement;

		config: IMolvwrConfig;
		context: BabylonContext;

		constructor(element: HTMLElement, config?: IMolvwrConfig) {
			if (!element)
				throw new Error("you must provide an element to host the viewer")
			this.config = config || Molvwr.defaultConfig;
			this.element = element;
			this.canvas = <HTMLCanvasElement>document.createElement("CANVAS");
			this.element.appendChild(this.canvas);
			this.context = new BabylonContext(this.canvas);
			this.context.createScene();			
		}

		loadContentFromString(content: string, contentFormat: string) {
			var parser = Molvwr.Parser[contentFormat];
			if (parser) {
				var molecule = parser.parse(content);
				if (molecule) {
					var rendererClass = Molvwr.Renderer[this.config.renderer];
					if (rendererClass) {
						var renderer = new rendererClass(this.context, this.config);
						renderer.render(molecule);
					} else {
						console.warn("no renderer for " + this.config.renderer);
					}
				} else {
					console.warn("no molecule from parser " + contentFormat);
				}
			} else {
				console.warn("no parser for " + contentFormat);
			}
		}

		loadContentFromUrl(url: string, contentFormat: string) {
			try {           
                var xhr = new XMLHttpRequest(); 
                xhr.onreadystatechange = () => { 
                    if(xhr.readyState == 4)
                    {
                        if(xhr.status == 200)
                        { 
                            this.loadContentFromString(xhr.responseText, contentFormat);
                        } 
                        else  {
							console.warn("cannot get content from " + url + " " + xhr.status + " " + xhr.statusText);
                        } 
                    } 
                };
                
                xhr.open("GET", url, true);                
                xhr.send(null); 
            } catch(e) {
                console.error(e);                 
            }
		}
	}
}