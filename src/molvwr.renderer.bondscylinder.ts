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
				var rootMesh = this.createCylinder(binding, diameter, 0, rootConf.segments, rootConf.effects, rootConf.color);
				for (var i=1, l=this.config.cylinderLOD.length; i<l ; i++){
					var conf = this.config.cylinderLOD[i];
					if (conf.segments){
						var childCylinder = this.createCylinder(binding, diameter, i, conf.segments, conf.effects, conf.color);
						rootMesh.addLODLevel(conf.depth, childCylinder);
					} else{
						rootMesh.addLODLevel(conf.depth, null);
					}
				}
				return rootMesh;
			}else{
				return this.createCylinder(binding, diameter, 0, this.config.cylinderSegments, true, null);
			}	
			
		}
		
		createCylinder(binding, diameter:number, lodIndex:number, segments, useeffects, coloroverride){			
			//console.log("render cyl " + segments);
			var cylinder = BABYLON.Mesh.CreateCylinder("bondtemplate" + binding.key, binding.d, diameter, diameter, segments, 2, this.ctx.scene, false);
			
			var rootMat = new BABYLON.StandardMaterial('materialFor' + binding.key + lodIndex, this.ctx.scene);
			var atomAColor = coloroverride || binding.kindA.color;
			rootMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
			this.ctx.cylinderMaterial(cylinder, rootMat, useeffects);
			
        	// var atomAMat = new BABYLON.StandardMaterial('materialFor' + binding.key + binding.kindA.symbol+ "-" + lodIndex, this.ctx.scene);
			// var atomAColor = coloroverride || binding.kindA.color;
			// atomAMat.diffuseColor = new BABYLON.Color3(atomAColor[0], atomAColor[1], atomAColor[2]);
			// this.ctx.cylinderMaterial(atomAMat, useeffects);
			// 
			// var atomBMat = new BABYLON.StandardMaterial('materialFor' + binding.key + binding.kindB.symbol+ "-" + lodIndex, this.ctx.scene);
			// var atomBColor = coloroverride || binding.kindB.color;
			// atomBMat.diffuseColor = new BABYLON.Color3(atomBColor[0], atomBColor[1], atomBColor[2]);
			// this.ctx.cylinderMaterial(atomBMat, useeffects);
			// 
			// var rootMat = new BABYLON.MultiMaterial('materialFor' + binding.key+ "-" + lodIndex, this.ctx.scene);
			// rootMat.subMaterials.push(atomAMat);
			// rootMat.subMaterials.push(atomBMat);
			// 
			// var verticesCount = cylinder.getTotalVertices();
			// var indices = cylinder.getIndices();
			// var halfindices = ((indices.length/2) >> 0) - 3*segments;
			// cylinder.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, halfindices, cylinder));
			// cylinder.subMeshes.push(new BABYLON.SubMesh(1, 0, verticesCount, halfindices, indices.length - halfindices, cylinder));
			// 
			
			cylinder.material = rootMat;
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