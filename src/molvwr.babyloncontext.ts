module Molvwr {
	export interface IViewMode{
		createScene(context: BabylonContext);
		sphereMaterial(context: BabylonContext, material: BABYLON.StandardMaterial, useEffects : boolean);
		cylinderMaterial(context: BabylonContext, material: BABYLON.StandardMaterial, useEffects : boolean);
	}
	
	export class BabylonContext {
		engine: BABYLON.Engine;
		scene: BABYLON.Scene;
		camera: BABYLON.Camera;
		canvas: HTMLCanvasElement;
		atomsMaterials: any;
		viewMode : IViewMode;
		
		constructor(canvas, viewMode?) {
			this.canvas = canvas;
			this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true });
			this.atomsMaterials = {};
			this.engine.runRenderLoop(() => {
				if (this.scene)
					this.scene.render();
			});
			
			this.viewMode = viewMode;
			
			if (!this.viewMode){
				this.viewMode = new Molvwr.ViewModes.Toon();
			}
		}

		exportScreenshot() {
			return this.canvas.toDataURL("image/png");			
		}

		dispose() {
			this.engine.dispose();
		}

		sphereMaterial(atomMat: BABYLON.StandardMaterial, useEffects : boolean) {
			if (this.viewMode){
				this.viewMode.sphereMaterial(this, atomMat, useEffects);
			}
		}

		createScene() {
			if (this.scene)
				this.scene.dispose();

			console.log("create babylon scene");

			var scene = new BABYLON.Scene(this.engine);
			this.scene = scene;
			
			if (this.viewMode){
				this.viewMode.createScene(this);
			}
		}
	}
}