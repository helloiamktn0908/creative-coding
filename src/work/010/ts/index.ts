import p5 from "p5";

const sketch = (p: p5) => {
  const canvas_width = window.innerWidth;
  const canvas_height = window.innerHeight;
  let coefficient = 0.5;
  let isHoge = false;
  let img1: p5.Image;
  let img2: p5.Image;
  let img3: p5.Image;
  let img4: p5.Image;
  let hoge = 5;

  p.preload = () => {
    img1 = p.loadImage("assets/people.png");
    img2 = p.loadImage("assets/01.jpg");
    img3 = p.loadImage("assets/hand.png");
    // img3 = p.loadImage("assets/diamond.png");
  };

  p.setup = () => {
    p.createCanvas(canvas_width, canvas_height);
    p.frameRate(9);
  };

  p.draw = () => {
    let rect_width = canvas_height / hoge;
    for (
      let i = 0;
      i <= canvas_width;
      i += rect_width, isHoge ? (rect_width *= 2) : (rect_width *= coefficient)
    ) {
      if (rect_width < 1) {
        isHoge = true;
      } else if (rect_width >= canvas_height / hoge) {
        isHoge = false;
      }
      for (let j = 0; j <= canvas_width; j += rect_width * 0.9) {
        const img = p.random([img1, img2, img3]);
        p.image(
          img,
          i,
          j,
          rect_width,
          rect_width,
          0,
          0,
          img.width,
          img.height,
          p.COVER
        );
      }
    }
    hoge = p.random(1.2, 5);
  };

  p.windowResized = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    // coefficient =
  };
};

new p5(sketch);
