module Molvwr.Renderer {
	export class BondsLines {
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
			console.log("rendering bonds as lines");
			molecule.bonds.forEach((b, index) => {
				var line = BABYLON.Mesh.CreateLines("bond-" + index, [
					new BABYLON.Vector3(b.atomA.x, b.atomA.y, b.atomA.z),
					new BABYLON.Vector3(b.atomB.x, b.atomB.y, b.atomB.z),
				], this.ctx.scene, false);
				line.color = new BABYLON.Color3(0.5, 0.5, 0.5);
				meshes.push(line);
			});
			
			if (completedCallback)
					completedCallback();
		}
	}
}