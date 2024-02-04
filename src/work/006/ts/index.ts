import p5 from "p5";

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background("#939393");
  };

  p.draw = () => {
    if (p.mouseIsPressed) {
      p.fill("rgb(60, 60, 60)");
    } else {
      p.fill("rgb(0,255,0)");
    }
    p.ellipse(p.mouseX, p.mouseY, 80, 80);
  };
};

new p5(sketch);
