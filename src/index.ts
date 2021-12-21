import {
    AmbientLight,
    AxesHelper,
    Color,
    DirectionalLight, FogExp2, Group, Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,

    PerspectiveCamera,
    PlaneBufferGeometry,
    PointLight,
    PointLightHelper,
    Renderer, Scene,
    SphereBufferGeometry,
    WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

let canvas = document.querySelector("#c") as HTMLCanvasElement;
const renderer = new WebGLRenderer({ canvas });
const camera = new PerspectiveCamera(40, 2, 0.1, 500);
const controls = new OrbitControls(camera, renderer.domElement);
const scene = new Scene();

{
    scene.fog = new FogExp2(0x555555, .01250);
    scene.background = new Color(0x444444)
}

{
    controls.target.set(0, 10, 20);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;

    controls.minDistance = 30;

    controls.maxDistance = 110;
}

camera.position.set(0, 10, 60);
camera.lookAt(0, 0, 0);

// {
//     const plane = new Mesh(new PlaneBufferGeometry(2000, 2000, 2, 2), new MeshBasicMaterial({ color: 0x999999 }));
//     scene.add(plane);
//     plane.rotateX(-Math.PI / 2)
//     // plane.position.set(0,-10,0);

// }



{
    let tree: Group;
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
   
    mtlLoader.load("../models/lowpoly/tree.mtl", materials => {
        
        materials.preload();
        
        console.log(materials)
        objLoader.setMaterials(materials);
        objLoader.load("../models/lowpoly/tree.obj", obj => {
            tree = obj;
            scene.add(tree);
            tree.scale.set(5, 5, 5);

            //@ts-ignore
            tree.children[107].material.shininess=0
            //@ts-ignore
            console.log(tree.children)
        })

    })


}


{

    let ambientLight = new AmbientLight(0xffffff,0.3);
    scene.add(ambientLight);


    let pointLight = new PointLight(0xFFFFDD,1.1);
    pointLight.position.set(3,25,3);
    scene.add(pointLight);

    
    
}


function resizeRendererToDisplaySize(renderer: Renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }

    return needResize;
}


function render() {


    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);


