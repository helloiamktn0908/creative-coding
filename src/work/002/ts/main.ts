import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import hdr1 from "../img/winter_evening_1k.hdr";
import hdr4 from "../img/winter_evening_4k.hdr";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

let model: THREE.Group<THREE.Object3DEventMap>;
let rotationSpeed = 0;

// シーンを作成
const scene = new THREE.Scene();

// レンダラーを作成
const canvasElement = document.querySelector("#myCanvas");
const renderer = new THREE.WebGLRenderer({
  antialias: true, // ギザギザ解消
  canvas: canvasElement || undefined,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// HDRI画像を読み込む
new RGBELoader().load(hdr1, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});
new RGBELoader().load(hdr4, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
});

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

// 3Dモデルをロード
const loader = new GLTFLoader();
loader.load(
  "./img/women.glb",
  function (gltf) {
    // const modelGUI = gui.addFolder("Model");
    model = gltf.scene;
    // モデルの境界ボックスを計算します
    const box = new THREE.Box3().setFromObject(model);
    // モデルの幅を取得します
    const modelWidth = box.max.x - box.min.x;
    // 新しいサイズを計算する
    const newWidth = window.innerWidth * 0.25;
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
    model.position.y = -yOffset - 5;
    // シーンにモデルを追加します
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// マウスホイールイベントのリスナーを追加
window.addEventListener("wheel", function (event) {
  // マウスホイールの動きに応じて回転速度を増やすか減らすかを決定
  rotationSpeed += event.deltaY * 0.0002;
});

function onWindowResize() {
  // カメラのアスペクト比を更新
  camera.aspect = window.innerWidth / window.innerHeight;

  // カメラの投影行列を更新
  camera.updateProjectionMatrix();

  // レンダラーのサイズを更新
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

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
