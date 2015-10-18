module Molvwr {
	export interface IViewMode{
		createScene(context: BabylonContext);
		sphereMaterial(context: BabylonContext, mesh : BABYLON.Mesh, material: BABYLON.StandardMaterial, useEffects : boolean);
		cylinderMaterial(context: BabylonContext, mesh : BABYLON.Mesh, material: BABYLON.StandardMaterial, useEffects : boolean);
	}
	
	export class BabylonContext {
		engine: BABYLON.Engine;
		scene: BABYLON.Scene;
		camera: BABYLON.Camera;
		canvas: HTMLCanvasElement;
		viewmode : IViewMode;
		
		constructor(canvas) {
			this.canvas = canvas;
			this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true });
			this.engine.runRenderLoop(() => {
				if (this.scene)
					this.scene.render();
			});						
		}

		exportScreenshot() {
			return this.canvas.toDataURL("image/png");			
		}

		dispose() {
			this.engine.dispose();
		}

		sphereMaterial(mesh : BABYLON.Mesh, atomMat: BABYLON.StandardMaterial, useEffects : boolean) {
			if (this.viewmode){
				this.viewmode.sphereMaterial(this, mesh, atomMat, useEffects);
			}
		}
		
		cylinderMaterial(mesh : BABYLON.Mesh, atomMat: BABYLON.StandardMaterial, useEffects : boolean) {
			if (this.viewmode){
				this.viewmode.cylinderMaterial(this, mesh, atomMat, useEffects);
			}
		}

		createScene() {
			if (this.scene)
				this.scene.dispose();

			console.log("create babylon scene");

			var scene = new BABYLON.Scene(this.engine);
			this.scene = scene;
			
			if (this.viewmode){
				this.viewmode.createScene(this);
			}
		}
	}
}