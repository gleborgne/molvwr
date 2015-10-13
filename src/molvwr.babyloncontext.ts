module Molvwr {
	export class BabylonContext {
		engine: BABYLON.Engine;
		scene: BABYLON.Scene;
		camera: BABYLON.Camera;
		canvas: HTMLCanvasElement;
		atomsMaterials: any;

		constructor(canvas) {
			this.canvas = canvas;
			this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true });
			this.atomsMaterials = {};
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

		getMaterial(atomMat: BABYLON.StandardMaterial) {
			var texturescale = 12;
			var texture = "174"
				
				
			// atomMat.diffuseTexture   = new BABYLON.Texture('textures/' + texture + '.jpg', this.scene);
			// (<any>atomMat.diffuseTexture).uScale = texturescale;
			// (<any>atomMat.diffuseTexture).vScale = texturescale;
				
			atomMat.specularTexture = new BABYLON.Texture('textures/' + texture + '.jpg', this.scene);
			(<any>atomMat.specularTexture).uScale = texturescale;
			(<any>atomMat.specularTexture).vScale = texturescale;

			atomMat.bumpTexture = new BABYLON.Texture('textures/' + texture + '_norm.jpg', this.scene);
			(<any>atomMat.bumpTexture).uScale = texturescale;
			(<any>atomMat.bumpTexture).vScale = texturescale;
			// atomMat.bumpTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE;
			// atomMat.bumpTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE;

			return atomMat;
		}

		createScene() {
			if (this.scene)
				this.scene.dispose();

			console.log("create babylon scene");

			var scene = new BABYLON.Scene(this.engine);
			this.scene = scene;
			scene.clearColor = new BABYLON.Color3(100, 100, 100);
			scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
			scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);
			scene.fogDensity = 0.01;

			var camera = new BABYLON.ArcRotateCamera('Camera', 1, .8, 28, new BABYLON.Vector3(0, 0, 0), scene);
			camera.wheelPrecision = 10;
			camera.pinchPrecision = 7;
			camera.panningSensibility = 70;
			camera.setTarget(BABYLON.Vector3.Zero());
			camera.attachControl(this.canvas, true);
			this.camera = camera;
			
			//var light = new BABYLON.Light("simplelight", scene);
			
			var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(40, 40, 40), scene);
			light.intensity = 0.7;			

			//this.useAmbientOcclusion();
			//this.useHDR();
			//this.useLensEffect();
		}

		useAmbientOcclusion() {
			var ssao = new BABYLON.SSAORenderingPipeline('ssaopipeline', this.scene, 0.75);
			this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssaopipeline", this.camera);
			//this.scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline("ssaopipeline", this.camera);
		}

		useHDR() {
			var hdr = new BABYLON.HDRRenderingPipeline("hdr", this.scene, 1.0, null, [this.camera]);
			// About gaussian blur : http://homepages.inf.ed.ac.uk/rbf/HIPR2/gsmooth.htm
			hdr.brightThreshold = 1.2; // Minimum luminance needed to compute HDR
			hdr.gaussCoeff = 0.3; // Gaussian coefficient = gaussCoeff * theEffectOutput;
			hdr.gaussMean = 1; // The Gaussian blur mean
			hdr.gaussStandDev = 0.8; // Standard Deviation of the gaussian blur.
			hdr.exposure = 1; // Controls the overall intensity of the pipeline
			hdr.minimumLuminance = 0.5; // Minimum luminance that the post-process can output. Luminance is >= 0
			hdr.maximumLuminance = 1e10; //Maximum luminance that the post-process can output. Must be suprerior to minimumLuminance 
			hdr.luminanceDecreaseRate = 0.5; // Decrease rate: white to dark
			hdr.luminanceIncreaserate = 0.5; // Increase rate: dark to white
			this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("hdr", [this.camera]);
			//this.scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline("hdr", [this.camera]);
		}

		useLensEffect() {
			var lensEffect = new BABYLON.LensRenderingPipeline('lens', {
				edge_blur: 0.2, //1.0,
				chromatic_aberration: 0.2, //1.0,
				distortion: 0.2, //1.0,
				dof_focus_depth: 100 / this.camera.maxZ,
				dof_aperture: 1.0,
				grain_amount: 0.2, //1.0,
				dof_pentagon: true,
				dof_gain: 1.0,
				dof_threshold: 1.0,
			}, this.scene, 1.0, [this.camera]);
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