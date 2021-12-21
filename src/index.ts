import {
    DirectionalLight, Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Renderer, Scene,
    SphereBufferGeometry,
    WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

let canvas = document.querySelector("#c") as HTMLCanvasElement;
const renderer = new WebGLRenderer({canvas});
const camera = new PerspectiveCamera(40, 2, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);
controls.update();


camera.position.set(0, 20, 100);
camera.lookAt(0, 0, 0);

const scene = new Scene();

const sphere = new Mesh(new SphereBufferGeometry(20, 1000), new MeshBasicMaterial({color: 0x449900}));
scene.add(sphere);

{

    let light = new DirectionalLight("0xFFFFFF", 1);
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

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);


