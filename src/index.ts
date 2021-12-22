import {
    AdditiveBlending,
    AmbientLight,

    BufferGeometry,
    Color,
    Float32BufferAttribute, FogExp2, Group,


    PerspectiveCamera,

    PointLight,

    Points,
    PointsMaterial,
    Renderer, Scene,

    TextureLoader,
    WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"


let canvas = document.createElement("canvas");
canvas.id = "c";
//@ts-ignore
document.getElementById("body").prepend(canvas);
canvas.style.cssText = " overflow:hidden; position:fixed; height: 100%; width: 100%; "

const renderer = new WebGLRenderer({ canvas });
const camera = new PerspectiveCamera(40, 2, 0.1, 500);
const controls = new OrbitControls(camera, renderer.domElement);
const scene = new Scene();

{
    scene.fog = new FogExp2(0x555555, .01250);
    scene.background = new Color(0x333333)
}

{
    controls.target.set(0, 12, 15);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;

    controls.minDistance = 30;

    controls.maxDistance = 110;
}

camera.position.set(0, 12, 60);
camera.lookAt(0, 0, 0);



function loadOBJ(
    mtlURL: string,
    objURL: string,
    resolveGeometry: { (geometry: Group): void } = function test(geometry: Group) {
        return;
    }) {
    let geometry: Group;
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();

    mtlLoader.load(mtlURL, materials => {

        materials.preload();


        objLoader.setMaterials(materials);
        objLoader.load(objURL, obj => {
            geometry = obj;
            scene.add(geometry);
            geometry.scale.set(5, 5, 5);
            resolveGeometry(geometry);

        })

    })


}


function resolveSnowManGeometry(geometry: Group) {
    geometry.position.set(-25, -2, 0);
    geometry.rotateY(Math.PI / 3);
}

function resolveTreeGeometry(geometry: Group) {
    //@ts-ignore
    geometry.children[107].material.shininess = 0;
    //@ts-ignore
    geometry.children[106].material.emissive = {r: 1, g: .7, b:.3};
    

}

function resolveGiftGeometry(geometry: Group) {
    geometry.scale.set(.7, .7, .7);

}

loadOBJ("https://files.catbox.moe/h3u12c.mtl", "https://files.catbox.moe/dnbuex.obj", resolveTreeGeometry);
loadOBJ("https://files.catbox.moe/qrxrb0.mtl", "https://files.catbox.moe/7i09rd.obj", resolveSnowManGeometry);
{

    const gltfLoader = new GLTFLoader();
    gltfLoader.load("https://files.catbox.moe/npoief.gltf", (gltf) => {
        gltf.scene.scale.set(.7, .7, .7);
        gltf.scene.position.set(0, -5, 0);
        scene.add(gltf.scene);
    })

}







{

    let ambientLight = new AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);


    let pointLight = new PointLight(0xFFFFDD, 1);
    pointLight.position.set(3, 25, 3);
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

const snow: Points[] = [];


{
    const geometry = new BufferGeometry();
    const vertices = [];

    const textureLoader = new TextureLoader();

    const sprite1 = textureLoader.load('https://threejs.org/examples/textures/sprites/snowflake1.png');
    const sprite2 = textureLoader.load('https://threejs.org/examples/textures/sprites/snowflake2.png');
    const sprite3 = textureLoader.load('https://threejs.org/examples/textures/sprites/snowflake3.png');
    const sprite4 = textureLoader.load('https://threejs.org/examples/textures/sprites/snowflake4.png');
    const sprite5 = textureLoader.load('https://threejs.org/examples/textures/sprites/snowflake5.png');

    for (let i = 0; i < 500; i++) {

        const x = Math.random() * 200 - 100;
        const y = Math.random() * 200 - 100;
        const z = Math.random() * 200 - 100;

        vertices.push(x, y, z);

    }

    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

    const parameters = [
        [[1.0, 0.2, 0.5], sprite2, 20],
        [[0.95, 0.1, 0.5], sprite3, 15],
        [[0.90, 0.05, 0.5], sprite1, 10],
        [[0.85, 0, 0.5], sprite5, 8],
        [[0.80, 0, 0.5], sprite4, 5]
    ];
    let materials = [];

    for (let i = 0; i < parameters.length; i++) {

        const color = parameters[i][0];
        const sprite = parameters[i][1];
        const size = parameters[i][2];

        //@ts-ignore
        materials[i] = new PointsMaterial({ size: size * .3, alphaMap: sprite, blending: AdditiveBlending, transparent: true, sizeAttenuation: true, depthWrite: false });
        //@ts-ignore
        materials[i].color.setHSL(color[0], color[1], color[2]);

        const particles = new Points(geometry, materials[i]);

        particles.rotation.x = Math.random() * 6;
        particles.rotation.y = Math.random() * 6;
        particles.rotation.z = Math.random() * 6;

        scene.add(particles);
        snow.push(particles);

    }
}




function render() {


    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    controls.update();

    (() => {
        snow.forEach(particle => {
            const position = particle.position.y;
            particle.position.y = particle.position.y < -150 ? 200 : particle.position.y - .025;
            particle.rotateY(.001);
        })
    })()

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);


