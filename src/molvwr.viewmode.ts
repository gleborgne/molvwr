module Molvwr.ViewModes {
	export var sphereBumpTexture : string = null;
	export var sphereSpecularTexture : string = null;
	export var sphereTextureScale : number = 1;
	
	export class Experiments implements Molvwr.IViewMode {
		constructor(){
		}
		
		createScene(context: BabylonContext){
			context.scene.clearColor = new BABYLON.Color3(0.9, 0.9, 0.95);
			context.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
			context.scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);
			context.scene.fogDensity = 0.01;

			var camera = new BABYLON.ArcRotateCamera('Camera', 1, .8, 28, new BABYLON.Vector3(0, 0, 0), context.scene);
			camera.wheelPrecision = 10;
			camera.pinchPrecision = 7;
			camera.panningSensibility = 70;
			camera.setTarget(BABYLON.Vector3.Zero());
			camera.attachControl(context.canvas, false);
			context.camera = camera;
			
			//var light = new BABYLON.Light("simplelight", scene);
			
			var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), context.scene);
			light.intensity = 0.7;			
			light.groundColor = new BABYLON.Color3(0.4,0.4,0.4);
			light.specular = new BABYLON.Color3(0.5,0.5,0.5);
			
			//this.useAmbientOcclusion();
			//this.useHDR();
			//this.useLensEffect();
		}
		
		sphereMaterial(context: BabylonContext, material: BABYLON.StandardMaterial, useEffects : boolean){
			if(Molvwr.ViewModes.sphereSpecularTexture){
				material.specularTexture = new BABYLON.Texture(Molvwr.ViewModes.sphereSpecularTexture, context.scene);
				(<any>material.specularTexture).uScale = Molvwr.ViewModes.sphereTextureScale || 1;
				(<any>material.specularTexture).vScale = Molvwr.ViewModes.sphereTextureScale || 1;
			}
				
			if (Molvwr.ViewModes.sphereBumpTexture){
				material.bumpTexture = new BABYLON.Texture(Molvwr.ViewModes.sphereBumpTexture, context.scene);
				(<any>material.bumpTexture).uScale = Molvwr.ViewModes.sphereTextureScale || 1;
				(<any>material.bumpTexture).vScale = Molvwr.ViewModes.sphereTextureScale || 1;
			}
		}
		
		cylinderMaterial(context: BabylonContext, material: BABYLON.StandardMaterial, useEffects : boolean){
			
		}
		
		useAmbientOcclusion(context: BabylonContext) {
			var ssao = new BABYLON.SSAORenderingPipeline('ssaopipeline', context.scene, 0.75);
			context.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssaopipeline", context.camera);
			//this.scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline("ssaopipeline", this.camera);
		}

		useHDR(context: BabylonContext) {
			var hdr = new BABYLON.HDRRenderingPipeline("hdr", context.scene, 1.0, null, [context.camera]);
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
			context.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("hdr", [context.camera]);
			//this.scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline("hdr", [this.camera]);
		}

		useLensEffect(context: BabylonContext) {
			var lensEffect = new BABYLON.LensRenderingPipeline('lens', {
				edge_blur: 0.2, //1.0,
				chromatic_aberration: 0.2, //1.0,
				distortion: 0.2, //1.0,
				dof_focus_depth: 100 / context.camera.maxZ,
				dof_aperture: 1.0,
				grain_amount: 0.2, //1.0,
				dof_pentagon: true,
				dof_gain: 1.0,
				dof_threshold: 1.0,
			}, context.scene, 1.0, [context.camera]);
		}
	}
}