import p5 from "p5";

const sketch = (p: p5) => {
  let count = 0;
  const arc_width = 10;
  const ellipse_width = arc_width * 0.3;
  const arc_stroke_weight = 1.5;
  const canvas_width = p.windowWidth;
  const canvas_height = p.windowHeight;

  p.setup = () => {
    p.createCanvas(canvas_width, canvas_height);
    p.frameRate(7);
  };

  p.draw = () => {
    p.background("#bfbfbf");
    for (let i = 0; i <= p.windowWidth; i += arc_width) {
      for (let j = 0; j <= p.windowHeight; j += arc_width) {
        count = count + p.floor(p.random(4));

        p.noFill();
        p.strokeWeight(arc_stroke_weight);
        if (count % 4 === 0 || count % 4 === 1) {
          p.stroke("#fc3fff");
          p.arc(i, j, arc_width, arc_width, p.PI / 2, p.PI);
        } else if (count % 4 === 2 || count % 4 === 3) {
          p.stroke("#3067ff");
          p.arc(i, j, arc_width, arc_width, p.PI + p.PI / 2, p.TWO_PI);
          p.noStroke();
          p.fill("#57ff36");
          p.ellipse(i, j, ellipse_width);
        }
      }
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(sketch);
