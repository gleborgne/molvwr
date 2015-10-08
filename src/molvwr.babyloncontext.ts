module Molvwr {
	export class BabylonContext {
		engine: BABYLON.Engine;
		scene: BABYLON.Scene;
		camera: BABYLON.Camera;
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
				atomMat.specularColor = new BABYLON.Color3(0.15,0.15,0.15);
				atomMat.emissiveColor = new BABYLON.Color3(0.1,0.1,0.1);
				atomMat.bumpTexture   = new BABYLON.Texture('bump.png', this.scene);
				// atomMat.bumpTexture.uScale = 1;
				// atomMat.bumpTexture.vScale = 1;
				// atomMat.bumpTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
				// atomMat.bumpTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;

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
			scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
			scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);
    		scene.fogDensity = 0.01;
			
			var camera = new BABYLON.ArcRotateCamera('Camera', 1, .8, 10, new BABYLON.Vector3(0, 0, 0), scene);
			camera.wheelPrecision = 10;
			camera.setTarget(BABYLON.Vector3.Zero());
			camera.attachControl(this.canvas, true);
			this.camera = camera;
		
			var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 20, 0), scene);
			light.intensity = 0.8;			

			

			
			
			this.scene = scene;
		}
		
		useAmbientOcclusion(){
			var ssao = new BABYLON.SSAORenderingPipeline('ssaopipeline', this.scene, 0.75);
			this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssaopipeline", this.camera);
			//this.scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline("ssaopipeline", this.camera);
		}
		
		useHDR(){
			var hdr = new BABYLON.HDRRenderingPipeline("hdr", this.scene, 1.0, null, [this.camera]);
			// About gaussian blur : http://homepages.inf.ed.ac.uk/rbf/HIPR2/gsmooth.htm
			hdr.brightThreshold = 1.2; // Minimum luminance needed to compute HDR
			hdr.gaussCoeff = 0.3; // Gaussian coefficient = gaussCoeff * theEffectOutput;
			hdr.gaussMean = 1; // The Gaussian blur mean
			hdr.gaussStandDev = 0.8; // Standard Deviation of the gaussian blur.
			hdr.exposure = 1.0; // Controls the overall intensity of the pipeline
			hdr.minimumLuminance = 0.5; // Minimum luminance that the post-process can output. Luminance is >= 0
			hdr.maximumLuminance = 1e20; //Maximum luminance that the post-process can output. Must be suprerior to minimumLuminance 
			hdr.luminanceDecreaseRate = 0.5; // Decrease rate: white to dark
			hdr.luminanceIncreaserate = 0.5; // Increase rate: dark to white
			this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("hdr", [this.camera]);
			//this.scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline("hdr", [this.camera]);
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