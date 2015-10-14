declare module Molvwr {
    interface IViewMode {
        createScene(context: BabylonContext): any;
        sphereMaterial(context: BabylonContext, material: BABYLON.StandardMaterial, useEffects: boolean): any;
        cylinderMaterial(context: BabylonContext, material: BABYLON.StandardMaterial, useEffects: boolean): any;
    }
    class BabylonContext {
        engine: BABYLON.Engine;
        scene: BABYLON.Scene;
        camera: BABYLON.Camera;
        canvas: HTMLCanvasElement;
        atomsMaterials: any;
        viewMode: IViewMode;
        constructor(canvas: any, viewMode?: any);
        exportScreenshot(): string;
        dispose(): void;
        sphereMaterial(atomMat: BABYLON.StandardMaterial, useEffects: boolean): void;
        createScene(): void;
    }
}

declare module Molvwr.Config {
    interface IMolvwrConfig {
        allowLOD: boolean;
        renderers: string[];
        atomScaleFactor: number;
        cylinderScale: number;
        cylinderLOD?: any[];
        sphereSegments: number;
        cylinderSegments?: number;
        sphereLOD?: any[];
    }
    function defaultConfig(): IMolvwrConfig;
    function spheres(): IMolvwrConfig;
    function ballsAndSticks(): IMolvwrConfig;
}

declare module Molvwr {
    class Viewer {
        element: HTMLElement;
        canvas: HTMLCanvasElement;
        config: Molvwr.Config.IMolvwrConfig;
        context: BabylonContext;
        molecule: any;
        constructor(element: HTMLElement, config?: Molvwr.Config.IMolvwrConfig);
        private _loadContentFromString(content, contentFormat, completedcallback);
        renderMolecule(molecule: any, completedcallback: any): void;
        setOptions(options: any, completedcallback: any): void;
        createContext(): void;
        exportScreenshot(): string;
        loadContentFromString(content: string, contentFormat: string, completedcallback: any): void;
        loadContentFromUrl(url: string, contentFormat: string, completedcallback: any): void;
        private _postProcessMolecule(molecule);
        private _calculateAtomsBonds(molecule);
        private _getCentroid(molecule);
        private _center(molecule);
    }
}

declare module Molvwr.Elements {
    interface PeriodicElement {
        symbol: string;
        name: string;
        mass: number;
        radius: number;
        color: number[];
        number: number;
    }
    var elements: PeriodicElement[];
    var elementsBySymbol: {};
    var elementsByNumber: {};
    var MIN_ATOM_RADIUS: number;
    var MAX_ATOM_RADIUS: number;
}

declare module Molvwr.Parser {
    var mol: {
        parse: (content: string) => {
            atoms: any[];
            title: any;
        };
    };
}

declare module Molvwr.Parser {
    var pdb: {
        parse: (content: string) => {
            atoms: any[];
            title: any;
        };
        parseHETATM(molecule: any, line: any): void;
    };
}

declare module Molvwr.Parser {
    var xyz: {
        parse: (content: string) => {
            atoms: any[];
            title: any;
        };
    };
}

declare module Molvwr.Renderer {
    class BondsCylinder {
        ctx: Molvwr.BabylonContext;
        config: Molvwr.Config.IMolvwrConfig;
        viewer: Molvwr.Viewer;
        meshes: any;
        constructor(viewer: Molvwr.Viewer, ctx: Molvwr.BabylonContext, config: Molvwr.Config.IMolvwrConfig);
        render(molecule: any, completedCallback: any): void;
        prepareBonds(molecule: any, diameter: any): void;
        createMesh(binding: any, diameter: any): BABYLON.Mesh;
        createCylinder(binding: any, diameter: any, segments: any, texture: any, coloroverride: any): BABYLON.Mesh;
        runBatch(offset: any, size: any, molecule: any, diameter: any, completedCallback: any): void;
        alignCylinderToBinding(b: any, cylinder: any): any;
        vectorEqualsCloseEnough(v1: any, v2: any, tolerance?: number): boolean;
    }
}

declare module Molvwr.Renderer {
    class BondsLines {
        ctx: Molvwr.BabylonContext;
        config: Molvwr.Config.IMolvwrConfig;
        viewer: Molvwr.Viewer;
        meshes: any;
        constructor(viewer: Molvwr.Viewer, ctx: Molvwr.BabylonContext, config: Molvwr.Config.IMolvwrConfig);
        render(molecule: any, completedCallback: any): void;
    }
}

declare module Molvwr.Renderer {
    class Sphere {
        ctx: Molvwr.BabylonContext;
        config: Molvwr.Config.IMolvwrConfig;
        viewer: Molvwr.Viewer;
        meshes: any;
        constructor(viewer: Molvwr.Viewer, ctx: Molvwr.BabylonContext, config: Molvwr.Config.IMolvwrConfig);
        render(molecule: any, completedCallback: any): void;
        prepareMeshes(molecule: any): void;
        createMesh(atomkind: any): BABYLON.Mesh;
        createSphere(atomkind: any, segments: any, useEffects: any, overridecolor: any): BABYLON.Mesh;
        runBatch(offset: any, size: any, molecule: any, completedCallback: any): void;
        renderAtom(atom: any, index: any): any;
    }
}

declare module Molvwr.Renderer {
    class Sticks {
        ctx: Molvwr.BabylonContext;
        config: Molvwr.Config.IMolvwrConfig;
        viewer: Molvwr.Viewer;
        meshes: any;
        constructor(viewer: Molvwr.Viewer, ctx: Molvwr.BabylonContext, config: Molvwr.Config.IMolvwrConfig);
        render(molecule: any, completedCallback: any): void;
        getCylinderForBinding(diameter: any, binding: any, index: any): any;
        alignCylinderToBinding(b: any, cylinder: any): any;
        vectorEqualsCloseEnough(v1: any, v2: any, tolerance?: number): boolean;
    }
}

declare module Molvwr.ViewModes {
    class Standard implements Molvwr.IViewMode {
        constructor();
        createScene(context: BabylonContext): void;
        sphereMaterial(context: BabylonContext, material: BABYLON.StandardMaterial, useEffects: boolean): void;
        cylinderMaterial(context: BabylonContext, material: BABYLON.StandardMaterial, useEffects: boolean): void;
    }
}

declare module Molvwr.ViewModes {
    interface ToonViewModeOptions {
        texture: boolean;
        bias: number;
        power: number;
    }
    class Toon implements Molvwr.IViewMode {
        options: ToonViewModeOptions;
        emisivefresnel: BABYLON.FresnelParameters;
        constructor(viewoptions?: ToonViewModeOptions);
        createScene(context: BabylonContext): void;
        sphereMaterial(context: BabylonContext, material: BABYLON.StandardMaterial, useEffects: boolean): void;
        cylinderMaterial(context: BabylonContext, material: BABYLON.StandardMaterial, useEffects: boolean): void;
    }
}

declare module Molvwr.ViewModes {
    var sphereBumpTexture: string;
    var sphereSpecularTexture: string;
    var sphereTextureScale: number;
    class Experiments implements Molvwr.IViewMode {
        constructor();
        createScene(context: BabylonContext): void;
        sphereMaterial(context: BabylonContext, material: BABYLON.StandardMaterial, useEffects: boolean): void;
        cylinderMaterial(context: BabylonContext, material: BABYLON.StandardMaterial, useEffects: boolean): void;
        useAmbientOcclusion(context: BabylonContext): void;
        useHDR(context: BabylonContext): void;
        useLensEffect(context: BabylonContext): void;
    }
}
