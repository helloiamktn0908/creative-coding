import p5 from "p5";

let backgroundColor = "rgb(99, 99, 99)";

const sketch = (p: p5) => {
  p.setup = () => {
    const img = p.createImg("assets/img.jpg", "background image");
    img.addClass("centered");
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(backgroundColor);
  };

  p.draw = () => {
    if (p.mouseIsPressed) {
      p.erase();
      p.ellipse(p.mouseX, p.mouseY, 100);
      p.noErase();
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.background(backgroundColor);
  };
};

new p5(sketch);
