import {
    AxesHelper,
    DirectionalLight, Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    PerspectiveCamera,
    PlaneBufferGeometry,
    Renderer, Scene,
    SphereBufferGeometry,
    WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let canvas = document.querySelector("#c") as HTMLCanvasElement;
const renderer = new WebGLRenderer({ canvas });
const camera = new PerspectiveCamera(40, 2, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);

{
    controls.target.set(0, 10, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;

    controls.minDistance = 100;
    controls.maxDistance = 500;
}

camera.position.set(0, 10, 30);
//camera.lookAt(0, 0, 0);

const scene = new Scene();
{
    const plane = new Mesh(new PlaneBufferGeometry(2000, 2000, 2, 2), new MeshBasicMaterial({ color: 0x999999 }));
    scene.add(plane);
    plane.rotateX(-Math.PI / 2)
    // plane.position.set(0,-10,0);

}

{
    const axesHelper = new AxesHelper(30);
    scene.add(axesHelper)
}

{

    let light = new DirectionalLight("0xFFFFFF", 1);
    light.position.set(0, 50, 0);
    scene.add(light);
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


