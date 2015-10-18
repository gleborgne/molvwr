declare module Molvwr {
    interface IViewMode {
        createScene(context: BabylonContext): any;
        sphereMaterial(context: BabylonContext, mesh: BABYLON.Mesh, material: BABYLON.StandardMaterial, useEffects: boolean): any;
        cylinderMaterial(context: BabylonContext, mesh: BABYLON.Mesh, material: BABYLON.StandardMaterial, useEffects: boolean): any;
    }
    class BabylonContext {
        engine: BABYLON.Engine;
        scene: BABYLON.Scene;
        camera: BABYLON.Camera;
        canvas: HTMLCanvasElement;
        viewmode: IViewMode;
        constructor(canvas: any);
        exportScreenshot(): string;
        dispose(): void;
        sphereMaterial(mesh: BABYLON.Mesh, atomMat: BABYLON.StandardMaterial, useEffects: boolean): void;
        cylinderMaterial(mesh: BABYLON.Mesh, atomMat: BABYLON.StandardMaterial, useEffects: boolean): void;
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
    function sticks(): IMolvwrConfig;
    function ballsAndSticks(): IMolvwrConfig;
}

declare var __global: any;
declare module Molvwr {
    function process(): void;
    class Viewer {
        element: HTMLElement;
        canvas: HTMLCanvasElement;
        config: Molvwr.Config.IMolvwrConfig;
        viewmode: IViewMode;
        context: BabylonContext;
        molecule: any;
        constructor(element: HTMLElement, config?: Molvwr.Config.IMolvwrConfig, viewmode?: IViewMode);
        dispose(): void;
        private _loadContentFromString(content, contentFormat, completedcallback);
        private _renderMolecule(molecule, completedcallback);
        setOptions(options: any, completedcallback?: any): void;
        setViewMode(viewmode: IViewMode, completedcallback?: any): void;
        refresh(completedcallback: any): void;
        private _createContext();
        exportScreenshot(): string;
        static endsWith(str: any, suffix: any): boolean;
        static getMoleculeFileFormat(filename: string): string;
        loadContentFromString(content: string, contentFormat: string, completedcallback?: any): void;
        loadContentFromUrl(url: string, contentFormat?: string, completedcallback?: any): void;
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
        createCylinder(binding: any, diameter: number, lodIndex: number, segments: any, useeffects: any, coloroverride: any): BABYLON.Mesh;
        runBatch(offset: any, size: any, molecule: any, diameter: any, completedCallback: any): void;
        alignCylinderToBinding(atomA: any, atomB: any, distance: any, cylinder: any): void;
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
        prepareBonds(molecule: any, diameter: any): void;
        createMesh(binding: any, diameter: any): any;
        createStickCylinder(binding: any, diameter: any, lodIndex: any, segments: any, texture: any, useeffects: any, coloroverride: any): BABYLON.Mesh;
        createStickMergemesh(binding: any, diameter: any, lodIndex: any, segments: any, texture: any, useeffects: any, coloroverride: any): BABYLON.Mesh;
        createStickCSG(binding: any, diameter: any, lodIndex: any, segments: any, texture: any, useeffects: any, coloroverride: any): BABYLON.Mesh;
        runBatch(offset: any, size: any, molecule: any, diameter: any, completedCallback: any): void;
        alignCylinderToBinding(atomA: any, atomB: any, distance: any, cylinder: any): void;
        vectorEqualsCloseEnough(v1: any, v2: any, tolerance?: number): boolean;
    }
}

declare module Molvwr.ViewModes {
    interface StandardViewModeOptions {
        texture?: boolean;
        onpreparescene?: (ctx: BabylonContext) => void;
        clearColor?: number[];
        fogDensity?: number;
        fogColor?: number[];
        groundColor?: number[];
        specular?: number[];
        wheelPrecision?: number;
        pinchPrecision?: number;
        panningSensibility?: number;
        emisivefresnel?: BABYLON.FresnelParameters;
        sphere?: {
            diffuseTexture?: string;
            specularTexture?: string;
            bumpTexture?: string;
            textureScale?: number;
        };
        cylinder?: {
            diffuseTexture?: string;
            specularTexture?: string;
            bumpTexture?: string;
            textureScale?: number;
        };
    }
    class Standard implements Molvwr.IViewMode {
        options: StandardViewModeOptions;
        constructor(viewoptions?: StandardViewModeOptions);
        static defaultConfig(): StandardViewModeOptions;
        getColor(config: any, defaultColor: any): BABYLON.Color3;
        createScene(context: BabylonContext): void;
        applyTexture(context: BabylonContext, material: BABYLON.StandardMaterial, texture: any): void;
        sphereMaterial(context: BabylonContext, mesh: BABYLON.Mesh, material: BABYLON.StandardMaterial, useEffects: boolean): void;
        cylinderMaterial(context: BabylonContext, mesh: BABYLON.Mesh, material: BABYLON.StandardMaterial, useEffects: boolean): void;
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
        sphereMaterial(context: BabylonContext, mesh: BABYLON.Mesh, material: BABYLON.StandardMaterial, useEffects: boolean): void;
        cylinderMaterial(context: BabylonContext, mesh: BABYLON.Mesh, material: BABYLON.StandardMaterial, useEffects: boolean): void;
    }
}

declare module Molvwr.ViewModes {
    class Experiments implements Molvwr.IViewMode {
        constructor();
        createScene(context: BabylonContext): void;
        sphereMaterial(context: BabylonContext, mesh: BABYLON.Mesh, material: BABYLON.StandardMaterial, useEffects: boolean): void;
        cylinderMaterial(context: BabylonContext, mesh: BABYLON.Mesh, material: BABYLON.StandardMaterial, useEffects: boolean): void;
        useAmbientOcclusion(context: BabylonContext): void;
        useHDR(context: BabylonContext): void;
        useLensEffect(context: BabylonContext): void;
    }
}
