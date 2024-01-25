import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import GUI from "lil-gui";
import hdr1 from "./winter_evening_1k.hdr";
import hdr4 from "./winter_evening_4k.hdr";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// const gui = new GUI();
let model: THREE.Group<THREE.Object3DEventMap>;
let rotationSpeed = 0;

const scene = new THREE.Scene();
// scene.background = new THREE.Color("#4c4c4c");

new RGBELoader().load(hdr1, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

new RGBELoader().load(hdr4, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
});

// 座標軸を表示
// var axes = new THREE.AxesHelper(100);
// scene.add(axes);

// const ambientLight = new THREE.AmbientLight("#ffffff", 1);
// const directionalLight = new THREE.DirectionalLight("#ffffff", 50);
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   5
// );
// scene.add(directionalLightHelper);
// scene.add(ambientLight, directionalLight);

// const lightPositionGUI = gui.addFolder("LightPosition");
// const lightRotationGUI = gui.addFolder("LightRotation");
// lightPositionGUI.add(directionalLight.position, "x", -100, 100, 1);
// lightPositionGUI.add(directionalLight.position, "y", -100, 100, 1);
// lightPositionGUI.add(directionalLight.position, "z", -100, 100, 1);
// lightRotationGUI.add(directionalLight.rotation, "x", -100, 100, 1);
// lightRotationGUI.add(directionalLight.rotation, "y", -100, 100, 1);
// lightRotationGUI.add(directionalLight.rotation, "z", -100, 100, 1);

const canvasElement = document.querySelector("#myCanvas");
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvasElement || undefined,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// カメラを作成
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 50;
camera.position.y = 15;
camera.lookAt(0, 0, 0);

// GLBをロード
const loader = new GLTFLoader();
loader.load(
  "./women.glb",
  function (gltf) {
    // const modelGUI = gui.addFolder("Model");
    model = gltf.scene;
    // モデルの境界ボックスを計算します
    const box = new THREE.Box3().setFromObject(model);
    // モデルの幅を取得します
    const modelWidth = box.max.x - box.min.x;
    // 新しいサイズを計算する
    const newWidth = window.innerWidth * 0.3;
    // スケールファクターを計算する
    const scale = newWidth / (1 / modelWidth);
    // モデルのスケールを変更する
    model.scale.set(scale, scale, scale);
    const newBox = new THREE.Box3().setFromObject(model);
    // モデルの高さを取得します
    const modelHeight = newBox.max.y - newBox.min.y;
    // モデルの中心点を世界の原点に置くための座標を計算します（Y軸方向に）
    const yOffset = modelHeight / 2;
    // モデルを中心に移動します
    model.position.y = -yOffset;
    // シーンにモデルを追加します
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// マウスホイールイベントのリスナーを追加します。
window.addEventListener("wheel", function (event) {
  // マウスホイールの動きに応じて回転速度を増やすか減らすかを決定します。
  rotationSpeed += event.deltaY * 0.0002;
});

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  // カメラのアスペクト比を更新
  camera.aspect = window.innerWidth / window.innerHeight;

  // カメラの投影行列を更新
  camera.updateProjectionMatrix();

  // レンダラーのサイズを更新
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  // ウェブページのスクロール位置に基づいて3Dモデルを回転
  if (model) {
    // 回転速度に基づいてモデルを回転させます。
    model.rotation.y += rotationSpeed;
    // 回転速度を少しずつ減速させます（「ぬめっ」とするため）
    rotationSpeed *= 0.95;
  }

  renderer.render(scene, camera);
}
animate();
