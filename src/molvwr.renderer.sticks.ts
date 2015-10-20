module Molvwr.Renderer {
	export class Sticks {
		ctx: Molvwr.BabylonContext;
		config: Molvwr.Config.IMolvwrConfig;
		viewer: Molvwr.Viewer;
		meshes: any = {};

		constructor(viewer: Molvwr.Viewer, ctx: Molvwr.BabylonContext, config: Molvwr.Config.IMolvwrConfig) {
			this.ctx = ctx;
			this.config = config;
			this.viewer = viewer;
		}

		render(molecule: IMolecule): Molvwr.Utils.Promise {
			var cfg = this.config;
			var meshes = [];
			var diameter = Molvwr.Elements.MIN_ATOM_RADIUS * this.config.cylinderScale * this.config.atomScaleFactor;
			var nbbonds = molecule.bonds.length;
			return this.prepareBonds(molecule, diameter).then(() => {
				console.time("sticks rendering");
				return Molvwr.Utils.runBatch(0, molecule.batchSize, molecule.bonds, (b, index) => {
					var key = b.atomA.kind.symbol + "#" + b.atomB.kind.symbol;
					var mesh = this.meshes[key];
					var cylinder = mesh.createInstance("bond" + index);
					this.alignCylinderToBinding(b.atomA, b.atomB, b.d, cylinder);
				}).then(() =>{
					console.timeEnd("sticks rendering");
				});
			});
		}

		prepareBonds(molecule: IMolecule, diameter:number) {
			console.time("prepare bonds as sticks");
			var bondkinds = [];
			for (var n in molecule.bondkinds){		
				bondkinds.push(molecule.bondkinds[n]);
			}	
			
			var batchSize = 50;
			if (this.config.cylinderLOD){
				batchSize = (batchSize / this.config.cylinderLOD.length) >> 0;
			}
			return Molvwr.Utils.runBatch(0, batchSize, bondkinds, (bondkind, index) =>{
				this.meshes[bondkind.key] = this.createMesh(bondkind, diameter);				
			}, "prepare sticks").then(() => {
				console.timeEnd("prepare bonds as sticks");
			});
		}

		createMesh(binding, diameter:number) {
			var processor = this.createStickMergemesh;
			if (this.config.cylinderLOD) {
				var rootConf = this.config.cylinderLOD[0];
				var rootMesh = processor.apply(this, [binding, diameter, 0, rootConf.segments, rootConf.texture, rootConf.effects, rootConf.color]);
				for (var i = 1, l = this.config.cylinderLOD.length; i < l; i++) {
					var conf = this.config.cylinderLOD[i];
					if (conf.segments) {
						var childCylinder = processor.apply(this, [binding, diameter, i, conf.segments, conf.texture, conf.effects, conf.color]);
						rootMesh.addLODLevel(conf.depth, childCylinder);
					} else {
						rootMesh.addLODLevel(conf.depth, null);
					}
				}
				return rootMesh;
			} else {
				return processor.apply(this, [binding, diameter, 0, this.config.cylinderSegments, true, true, null]);
			}

		}

		createStickMergemesh(binding, diameter, lodIndex, segments, texture, useeffects, coloroverride) {
			//console.log("create mesh template " + binding.key + " mergemesh " + lodIndex);
			var radius = diameter / 2;
			var cylinderSize = binding.d - (radius / 2.5);
			var halfCylinderSize = cylinderSize / 2;
			var cylinder = BABYLON.Mesh.CreateCylinder("bondtemplate" + binding.key + "-" + lodIndex, cylinderSize, diameter, diameter, segments, 2, this.ctx.scene, false);
			var cylinderIndices = cylinder.getIndices();
			var sphereA = BABYLON.Mesh.CreateSphere("sphereA" + binding.key + "-" + lodIndex, segments, diameter, this.ctx.scene, false);
			sphereA.position.y = -halfCylinderSize;
			var sphereB = BABYLON.Mesh.CreateSphere("sphereB" + binding.key + "-" + lodIndex, segments, diameter, this.ctx.scene, false);
			sphereB.position.y = halfCylinderSize;

			var capsule = BABYLON.Mesh.MergeMeshes([sphereA, cylinder, sphereB], true);

			var atomAMat = new BABYLON.StandardMaterial('materialFor' + binding.key + binding.kindA.symbol + "-" + lodIndex, this.ctx.scene);
			var atomAColor = coloroverride || binding.kindA.color;
			atomAMat.diffuseColor = new BABYLON.Color3(atomAColor[0], atomAColor[1], atomAColor[2]);
			this.ctx.cylinderMaterial(null, atomAMat, useeffects);

			var atomBMat = new BABYLON.StandardMaterial('materialFor' + binding.key + binding.kindB.symbol + "-" + lodIndex, this.ctx.scene);
			var atomBColor = coloroverride || binding.kindB.color;
			atomBMat.diffuseColor = new BABYLON.Color3(atomBColor[0], atomBColor[1], atomBColor[2]);
			this.ctx.cylinderMaterial(null, atomBMat, useeffects);

			var rootMat = new BABYLON.MultiMaterial('materialFor' + binding.key + "-" + lodIndex, this.ctx.scene);
			rootMat.subMaterials.push(atomAMat);
			rootMat.subMaterials.push(atomBMat);

			var verticesCount = capsule.getTotalVertices();
			var indices = capsule.getIndices();

			//console.log("has submeshes ? " + capsule.subMeshes.length + " indices " + indices.length);
			//console.log(indices);
			capsule.subMeshes = [];
			var halfindices = ((indices.length / 2) >> 0) - 3 * segments;
			capsule.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, halfindices, capsule));
			capsule.subMeshes.push(new BABYLON.SubMesh(1, 0, verticesCount, halfindices, indices.length - halfindices, capsule));

			capsule.material = rootMat;
			capsule.isPickable = false;
			capsule.setEnabled(false);

			return capsule;
		}

// 		createStickCSG(binding, diameter, lodIndex, segments, texture, useeffects, coloroverride) {
// 			console.log("create mesh template " + binding.key + " csg " + lodIndex);
// 			var atomAMat = new BABYLON.StandardMaterial('materialFor' + binding.key + binding.kindA.symbol + "-" + lodIndex, this.ctx.scene);
// 			var atomAColor = coloroverride || binding.kindA.color;
// 			//atomAMat.diffuseColor = new BABYLON.Color3(atomAColor[0], atomAColor[1], atomAColor[2]);
// 			atomAMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
// 
// 			atomAMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
// 			atomAMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
// 			this.ctx.cylinderMaterial(null, atomAMat, useeffects);
// 
// 			var atomBMat = new BABYLON.StandardMaterial('materialFor' + binding.key + binding.kindB.symbol + "-" + lodIndex, this.ctx.scene);
// 			var atomBColor = coloroverride || binding.kindB.color;
// 			//atomBMat.diffuseColor = new BABYLON.Color3(atomBColor[0], atomBColor[1], atomBColor[2]);
// 			atomBMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
// 			atomBMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
// 			atomBMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
// 			this.ctx.cylinderMaterial(null, atomBMat, useeffects);
// 
// 			var rootMat = new BABYLON.MultiMaterial('materialFor' + binding.key + "-" + lodIndex, this.ctx.scene);
// 			rootMat.subMaterials.push(atomAMat);
// 			rootMat.subMaterials.push(atomBMat);
// 
// 			var radius = diameter / 2;
// 			var cylinderSize = binding.d;
// 			var halfCylinderSize = cylinderSize / 2;
// 
// 			var sphereA = BABYLON.Mesh.CreateSphere("sphereA" + binding.key + "-" + lodIndex, segments * 0.5, diameter, this.ctx.scene, false);
// 			sphereA.position.y = -halfCylinderSize;
// 			sphereA.material = atomAMat;
// 
// 			var cylinderA = BABYLON.Mesh.CreateCylinder("cylinderAtemplate" + binding.key + "-" + lodIndex, cylinderSize / 2, diameter, diameter, segments, 2, this.ctx.scene, false);
// 			cylinderA.position.y = -cylinderSize / 4;
// 			cylinderA.material = atomAMat;
// 
// 			var cylinderB = BABYLON.Mesh.CreateCylinder("cylinderAtemplate" + binding.key + "-" + lodIndex, cylinderSize / 2, diameter, diameter, segments, 2, this.ctx.scene, false);
// 			cylinderB.position.y = cylinderSize / 4;
// 			cylinderB.material = atomBMat;
// 
// 			var sphereB = BABYLON.Mesh.CreateSphere("sphereB" + binding.key + "-" + lodIndex, segments * 0.5, diameter, this.ctx.scene, false);
// 			sphereB.position.y = halfCylinderSize;
// 			sphereB.material = atomBMat;
// 
// 			var sphereACSG = BABYLON.CSG.FromMesh(sphereA);
// 			var cylinderACSG = BABYLON.CSG.FromMesh(cylinderA);
// 			var cylinderBCSG = BABYLON.CSG.FromMesh(cylinderB);
// 			var sphereBCSG = BABYLON.CSG.FromMesh(sphereB);
// 
// 			var atomACSG = sphereACSG.union(cylinderACSG);
// 			var atomBCSG = sphereBCSG.union(cylinderBCSG);
// 
// 			var resCSG = atomACSG.union(atomBCSG);
// 
// 			var capsule = resCSG.toMesh("bondtemplate" + binding.key + "-" + lodIndex, rootMat, this.ctx.scene, false);
// 
// 			capsule.setPivotMatrix(BABYLON.Matrix.Translation(0, -binding.d / 4, 0));
// 
// 			capsule.isPickable = false;
// 			capsule.setEnabled(false);
// 
// 			cylinderA.setEnabled(false);
// 			cylinderB.setEnabled(false);
// 			sphereA.setEnabled(false);
// 			sphereB.setEnabled(false);
// 
// 			return capsule;
// 		}		

		alignCylinderToBinding(atomA, atomB, distance, cylinder) {
			//console.log("position items to " + atomB.x + "/" + atomB.y  + "/" +  atomB.z)
			var pointA = new BABYLON.Vector3(atomA.x, atomA.y, atomA.z);
			var pointB = new BABYLON.Vector3(atomB.x, atomB.y, atomB.z);

            var v1 = pointB.subtract(pointA);
			v1.normalize();
			var v2 = new BABYLON.Vector3(0, 1, 0);

			if (this.vectorEqualsCloseEnough(v1, v2.negate())) {
				//console.log("must invert...")
				var v2 = new BABYLON.Vector3(1, 0, 0);

				var axis = BABYLON.Vector3.Cross(v2, v1);
				axis.normalize();
				var angle = BABYLON.Vector3.Dot(v1, v2);
				angle = Math.acos(angle) + (Math.PI / 2);

				cylinder.setPivotMatrix(BABYLON.Matrix.Translation(0, -distance / 2, 0));
				cylinder.position = pointB;

				var quaternion = BABYLON.Quaternion.RotationAxis(axis, angle);
				quaternion.w = -quaternion.w;
				cylinder.rotationQuaternion = quaternion;
				console.log(cylinder.rotationQuaternion);
			} else {
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