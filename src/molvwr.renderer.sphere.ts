module Molvwr.Renderer {
	export class Sphere {	
		ctx: Molvwr.BabylonContext;
		config : Molvwr.Config.IMolvwrConfig;
		viewer : Molvwr.Viewer;
		meshes : any = {};
		
		constructor(viewer : Molvwr.Viewer, ctx: Molvwr.BabylonContext, config:Molvwr.Config.IMolvwrConfig){
			this.ctx = ctx;
			this.config = config;
			this.viewer = viewer;
		}	
		
		render(molecule : IMolecule) : Molvwr.Utils.Promise {
			return this.prepareMeshes(molecule).then(() => {
				console.time("sphere rendering");
				return Molvwr.Utils.runBatch(0, molecule.batchSize, molecule.atoms, this.renderAtom.bind(this), "sphere rendering").then(() => {
					console.timeEnd("sphere rendering");
				});	
			});			
		}
		
		prepareMeshes(molecule : IMolecule) : Molvwr.Utils.Promise {
			console.time("prepare spheres");
			var kinds = [];
			for (var n in molecule.kinds){		
				kinds.push(molecule.kinds[n]);
			}		
			
			return Molvwr.Utils.runBatch(0, 100, kinds, (atomkind, index) =>{
				this.meshes[atomkind.kind.symbol] = this.createMesh(atomkind.kind);
			}, "prepare spheres").then(function(){
				console.timeEnd("prepare spheres");
			});
		}
		
		createMesh(atomkind){			
			if (this.config.sphereLOD){
				//console.log("sphere " + atomkind.symbol + " use LOD " + this.config.sphereLOD.length);
				var rootConf = this.config.sphereLOD[0];
				var rootMesh = this.createSphere(atomkind, rootConf.segments, rootConf.effects, rootConf.color);
				for (var i=1, l=this.config.sphereLOD.length; i<l ; i++){
					var conf = this.config.sphereLOD[i];
					if (conf.segments){
						var childSphere = this.createSphere(atomkind, conf.segments, conf.effects, conf.color);
						rootMesh.addLODLevel(conf.depth, childSphere);
					} else{
						rootMesh.addLODLevel(conf.depth, null);
					}
				}				
				return rootMesh;
			}else{
				return this.createSphere(atomkind, this.config.sphereSegments, true, null);
			}
		}
		
		createSphere(atomkind, segments, useEffects, overridecolor){
			var sphere = BABYLON.Mesh.CreateSphere("spheretemplate", segments, atomkind.radius * this.config.atomScaleFactor, this.ctx.scene, false);
			sphere.setEnabled(false);
			sphere.isPickable = false;
			
			var atomMat = new BABYLON.StandardMaterial('materialFor' + atomkind.symbol, this.ctx.scene);
			var color = overridecolor || atomkind.color;
			atomMat.diffuseColor = new BABYLON.Color3(color[0], color[1], color[2]);			
			
			this.ctx.sphereMaterial(sphere, atomMat, useEffects);
			
			sphere.material = atomMat;
			
			return sphere;
		}
		
		renderAtom(atom, index){
			var cfg= this.config;
			var mesh = this.meshes[atom.kind.symbol];
			if (!mesh){
				console.warn("no mesh for " + atom.kind.symbol);
			}
			var sphere = mesh.createInstance("sphere" + index);
			
			// sphere = BABYLON.Mesh.CreateSphere("sphere" + index, cfg.sphereSegments, atomKind.radius * cfg.scale * cfg.atomScaleFactor, this.ctx.scene);
			// sphere.material = this.ctx.getMaterial(atom.symbol);
			sphere.pickable = false;
			sphere.position.x = atom.x;
			sphere.position.y = atom.y;
			sphere.position.z = atom.z;
			
			return sphere;
		}
	}
}