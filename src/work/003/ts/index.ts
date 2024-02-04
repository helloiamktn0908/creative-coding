import p5 from "p5";

let img: p5.Image;
let max_distance: number;

const sketch = (p: p5) => {
  p.preload = () => {
    img = p.loadImage("assets/index.jpeg");
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.imageMode(p.CENTER);
    p.noStroke();
    max_distance = p.dist(0, 0, p.width, p.height);
  };

  p.draw = () => {
    p.background("rgb(194, 171, 139)");
    p.image(img, p.width / 2, p.height / 2);

    for (let i = 0; i <= p.width; i += 15) {
      for (let j = 0; j <= p.height; j += 15) {
        let size = p.dist(p.mouseX, p.mouseY, i, j);
        size = (size / max_distance) * 66;
        p.fill("rgba(255, 255, 255, 1)");
        p.ellipse(i, j, size, size);
      }
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(sketch);
