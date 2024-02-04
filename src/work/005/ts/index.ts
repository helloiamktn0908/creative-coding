import * as THREE from "three";
import { createNoise3D } from "simplex-noise";
import { createNoise2D } from "simplex-noise";

let noise3D = createNoise3D();
let noise2D = createNoise2D();

let context: AudioContext | null = null;
let analyser: AnalyserNode | null = null;

let vizInit = function () {
  const fftSize = 512;

  const file: HTMLInputElement | null = document.getElementById(
    "thefile"
  ) as HTMLInputElement;
  const audio: HTMLAudioElement | null = document.getElementById(
    "audio"
  ) as HTMLAudioElement;
  const fileLabel: HTMLElement | null = document.querySelector("label.file");

  document.onload = function (e: Event) {
    console.log(e);
    if (audio) audio.play();
    play();
  };

  if (file) {
    file.onchange = function () {
      const files = this.files;
      fileLabel!.classList.add("normal");
      audio!.classList.add("active");
      audio!.src = URL.createObjectURL(files![0]);
      audio!.load();

      if (audio) {
        audio.play();
        play();
      }
    };
  }

  function play() {
    context = new AudioContext();
    const src = context.createMediaElementSource(audio!);
    analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = fftSize;

    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    let scene = new THREE.Scene();
    let group = new THREE.Group();
    let camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.set(0, 0, 100);
    camera.lookAt(scene.position);
    scene.add(camera);

    let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    let planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
    let planeMaterial = new THREE.MeshLambertMaterial({
      color: 0x6904ce,
      side: THREE.DoubleSide,
      wireframe: true,
    });

    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 30, 0);
    group.add(plane);

    let plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
    plane2.rotation.x = -0.5 * Math.PI;
    plane2.position.set(0, -30, 0);
    group.add(plane2);

    let icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
    let lambertMaterial = new THREE.MeshLambertMaterial({
      color: 0xff00ee,
      wireframe: true,
    });

    let ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    ball.position.set(0, 0, 0);
    group.add(ball);

    let ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.intensity = 0.9;
    spotLight.position.set(-10, 40, 20);
    spotLight.lookAt(ball);
    spotLight.castShadow = true;
    scene.add(spotLight);

    scene.add(group);
    const outElement = document.getElementById("out");

    if (outElement) {
      outElement.appendChild(renderer.domElement);
    }

    window.addEventListener("resize", onWindowResize, false);

    render();

    function render() {
      analyser!.getByteFrequencyData(dataArray);

      let lowerHalfArray = dataArray.slice(0, dataArray.length / 2 - 1);
      let upperHalfArray = dataArray.slice(
        dataArray.length / 2 - 1,
        dataArray.length - 1
      );

      let lowerMax = max(lowerHalfArray);
      let lowerAvg = average(lowerHalfArray);
      let upperMax = max(upperHalfArray);
      let upperAvg = average(upperHalfArray);

      let lowerMaxFr = lowerMax / lowerHalfArray.length;
      let lowerAvgFr = lowerAvg / lowerHalfArray.length;
      let upperMaxFr = upperMax / upperHalfArray.length;
      let upperAvgFr = upperAvg / upperHalfArray.length;

      makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
      makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));

      makeRoughBall(
        ball,
        modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8),
        modulate(upperAvgFr, 0, 1, 0, 4)
      );

      group.rotation.y += 0.005;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function makeRoughBall(mesh: THREE.Mesh, bassFr: number, treFr: number) {
      let geometry: any = mesh.geometry;
      geometry.vertices.forEach(function (
        vertex: {
          normalize: () => void;
          multiplyScalar: (arg0: number) => void;
        },
        i: number
      ) {
        let offset = geometry.parameters.radius;
        let amp = 7;
        let time = window.performance.now();
        vertex.normalize();
        let distance =
          offset +
          bassFr +
          noise3D(
            vertex.x + time * 0.0007,
            vertex.y + time * 0.0008,
            vertex.z + time * 0.0009
          ) *
            amp *
            treFr;
        vertex.multiplyScalar(distance);
      });
      geometry.verticesNeedUpdate = true;
      geometry.normalsNeedUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeFaceNormals();
    }

    function makeRoughGround(mesh: THREE.Mesh, distortionFr: number) {
      let geometry: any = mesh.geometry;
      geometry.vertices.forEach(function (vertex: { z: number }, i: number) {
        let amp = 2;
        let time = Date.now();
        let distance =
          (noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) *
          distortionFr *
          amp;
        vertex.z = distance;
      });
      geometry.verticesNeedUpdate = true;
      geometry.normalsNeedUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeFaceNormals();
    }

    if (audio) audio.play();
  }
};

window.onload = vizInit;

document.body.addEventListener("touchend", function (ev) {
  if (context) context.resume();
});

function fractionate(val: number, minVal: number, maxVal: number) {
  return (val - minVal) / (maxVal - minVal);
}

function modulate(
  val: number,
  minVal: number,
  maxVal: number,
  outMin: number,
  outMax: number
) {
  var fr = fractionate(val, minVal, maxVal);
  var delta = outMax - outMin;
  return outMin + fr * delta;
}

function average(arr: number[]) {
  var total = arr.reduce(function (sum: number, b: number) {
    return sum + b;
  });
  return total / arr.length;
}

function max(arr: number[]) {
  return arr.reduce(function (a: number, b: number) {
    return Math.max(a, b);
  });
}
