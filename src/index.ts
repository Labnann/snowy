import {
    AdditiveBlending,
    AmbientLight,
    AxesHelper,
    BufferGeometry,
    Color,
    DirectionalLight, Float32BufferAttribute, FogExp2, Group, Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,

    PerspectiveCamera,
    PlaneBufferGeometry,
    PointLight,
    PointLightHelper,
    Points,
    PointsMaterial,
    Renderer, Scene,
    SphereBufferGeometry,
    TextureLoader,
    WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";


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
    controls.target.set(0, 10, 20);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;

    controls.minDistance = 30;

    controls.maxDistance = 110;
}

camera.position.set(0, 10, 60);
camera.lookAt(0, 0, 0);




{
    let tree: Group;
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();

    mtlLoader.load("https://files.catbox.moe/h3u12c.mtl", materials => {

        materials.preload();

        console.log(materials)
        objLoader.setMaterials(materials);
        objLoader.load("https://files.catbox.moe/dnbuex.obj", obj => {
            tree = obj;
            scene.add(tree);
            tree.scale.set(5, 5, 5);

            //@ts-ignore
            tree.children[107].material.shininess = 0
            //@ts-ignore
            console.log(tree.children)
        })

    })


}


{

    let ambientLight = new AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);


    let pointLight = new PointLight(0xFFFFDD, 1.1);
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


{
    const snowGeometry = new BufferGeometry();
    const vertices = [];
    const sprite = new TextureLoader().load("https://media.discordapp.net/attachments/727611031106486307/867505288784117820/2.png");
    for (let i = 0; i < 1000; i++) {

        const x = 200 * Math.random() - 100;
        const y = 200 * Math.random() ;
        const z = 200 * Math.random() - 100;

        vertices.push(x, y, z);

    }

    snowGeometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    

    let snowMaterial = new PointsMaterial(
         {
       size: 10,
       sizeAttenuation: true,
       transparent: true,
       color: "#FF88CC",
       depthWrite: false,
       blending: AdditiveBlending,
       vertexColors:true
    }
    );
    snowMaterial.color.setHSL(1.0, 0.3, 0.7);
    snowMaterial.alphaMap = sprite;

    const particles = new Points(snowGeometry, snowMaterial);
    scene.add(particles);


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


