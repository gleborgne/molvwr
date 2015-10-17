module Molvwr.Renderer {
	export class BondsCylinder {
		ctx: Molvwr.BabylonContext;
		config: Molvwr.Config.IMolvwrConfig;
		viewer: Molvwr.Viewer;
		meshes: any = {};

		constructor(viewer: Molvwr.Viewer, ctx: Molvwr.BabylonContext, config: Molvwr.Config.IMolvwrConfig) {
			this.ctx = ctx;
			this.config = config;
			this.viewer = viewer;
		}

		render(molecule, completedCallback) {
			var cfg = this.config;
			var meshes = [];
			var diameter = Molvwr.Elements.MIN_ATOM_RADIUS * this.config.cylinderScale * this.config.atomScaleFactor;
			var nbbonds = molecule.bonds.length;
			//console.log("rendering " + nbbonds + " bonds as cylinder");
			this.prepareBonds(molecule, diameter);
			
			this.runBatch(0, molecule.batchSize, molecule, diameter, completedCallback); 
		}
		
		prepareBonds(molecule, diameter){
			for (var n in molecule.bondkinds){				
				this.meshes[n] = this.createMesh(molecule.bondkinds[n], diameter);
			}			
		}
		
		createMesh(binding, diameter){
			//console.log("create bind mesh " + binding.key);
			if (this.config.cylinderLOD){
				//console.log("cylinder LOD " + this.config.cylinderLOD.length)
				var rootConf = this.config.cylinderLOD[0];
				var rootMesh = this.createCylinder(binding, diameter, rootConf.segments, rootConf.texture, rootConf.color);
				for (var i=1, l=this.config.cylinderLOD.length; i<l ; i++){
					var conf = this.config.cylinderLOD[i];
					if (conf.segments){
						var childCylinder = this.createCylinder(binding, diameter, conf.segments, conf.texture, conf.color);
						rootMesh.addLODLevel(conf.depth, childCylinder);
					} else{
						rootMesh.addLODLevel(conf.depth, null);
					}
				}
				return rootMesh;
			}else{
				return this.createCylinder(binding, diameter, this.config.cylinderSegments, true, null);
			}	
			
		}
		
		createCylinder(binding, diameter, segments, texture, coloroverride){			
			//console.log("render cyl " + segments);
			var cylinder = BABYLON.Mesh.CreateCylinder("bondtemplate" + binding.key, binding.d, diameter, diameter, segments, 1, this.ctx.scene, false);
        	var atomMat = new BABYLON.StandardMaterial('materialFor' + binding.key, this.ctx.scene);
			atomMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
			atomMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
			atomMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
						
			cylinder.material = atomMat;
			cylinder.isPickable = false;
			cylinder.setEnabled(false);
			
			return cylinder;
		}
		
		runBatch(offset, size, molecule, diameter, completedCallback){
			setTimeout(()=>{
				console.log("batch rendering bonds " + offset + "/" + molecule.bonds.length);
				var items = molecule.bonds.slice(offset, offset + size);
				
				items.forEach((b, index) => {
					var key = b.atomA.kind.symbol + "#" + b.atomB.kind.symbol;
					var mesh = this.meshes[key];
					var cylinder = mesh.createInstance("bond" + index);
					this.alignCylinderToBinding(b.atomA, b.atomB, b.d, cylinder);
				});
				
				if (items.length < size){
					console.log("batch end " + items.length);
					if (completedCallback) completedCallback();
				}else{
					this.runBatch(offset+size, size, molecule, diameter, completedCallback);
				}
			},5);
		}

		alignCylinderToBinding(atomA, atomB, distance, cylinder) {
			var pointA = new BABYLON.Vector3(atomA.x, atomA.y, atomA.z);
			var pointB = new BABYLON.Vector3(atomB.x, atomB.y, atomB.z);
			
            var v1 = pointB.subtract(pointA);
			v1.normalize();
			var v2 = new BABYLON.Vector3(0, 1, 0);
            
			if (this.vectorEqualsCloseEnough(v1, v2.negate())) {
				console.log("must invert...")
				var v2 = new BABYLON.Vector3(1, 0, 0);
				
				var axis = BABYLON.Vector3.Cross(v2, v1);
				axis.normalize();				
				var angle = BABYLON.Vector3.Dot(v1, v2);
				angle = Math.acos(angle) + (Math.PI/2);
				
				cylinder.setPivotMatrix(BABYLON.Matrix.Translation(0, -distance / 2, 0));         
            	cylinder.position = pointB;
				
				var quaternion = BABYLON.Quaternion.RotationAxis(axis, angle);
				quaternion.w = -quaternion.w;
				cylinder.rotationQuaternion = quaternion;
				console.log(cylinder.rotationQuaternion);
			}else{
				var axis = BABYLON.Vector3.Cross(v2, v1);
				axis.normalize();
				var angle = BABYLON.Vector3.Dot(v1, v2);
				angle = Math.acos(angle);
			
				cylinder.setPivotMatrix(BABYLON.Matrix.Translation(0, -distance / 2, 0));         
	            cylinder.position = pointB;
        	
				cylinder.rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, angle);
			}
		}

		vectorEqualsCloseEnough(v1, v2, tolerance: number = 0.00002) {
			if (typeof (v2) !== 'object') { throw ("v2 is supposed to be an object"); }
			if (typeof (v1) !== 'object') { throw ("v1 is supposed to be an object"); }

			if (v1.x < v2.x - tolerance || v1.x > v2.x + tolerance) {
				return false;
			}
			if (v1.y < v2.y - tolerance || v1.y > v2.y + tolerance) {
				return false;
			}
			if (v1.z < v2.z - tolerance || v1.z > v2.z + tolerance) {
				return false;
			}

			return true;
		}
	}
}