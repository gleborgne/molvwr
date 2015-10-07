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
}