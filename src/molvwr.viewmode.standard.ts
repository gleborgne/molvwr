module Molvwr.ViewModes {
	export class Standard implements Molvwr.IViewMode {
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
			camera.attachControl(context.canvas, true);
			context.camera = camera;
			
			//var light = new BABYLON.Light("simplelight", scene);
			
			var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), context.scene);
			light.intensity = 0.7;			
			light.groundColor = new BABYLON.Color3(0.4,0.4,0.4);
			light.specular = new BABYLON.Color3(0.5,0.5,0.5);
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
	}
}