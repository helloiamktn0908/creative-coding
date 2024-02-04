import p5 from "p5";

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background("#303030");
  };

  p.draw = () => {
    p.textSize(100);
    if (p.mouseIsPressed) {
      p.text("🐣", p.mouseX, p.mouseY);
    } else {
      p.text("🥚", p.mouseX, p.mouseY);
    }
  };
};

new p5(sketch);
