import p5 from "p5";

const sketch = (p: p5) => {
  let img: p5.Element;
  let count = 0;
  const arc_width = 35;
  const ellipse_width = arc_width * 0.3;
  const arc_stroke_weight = 3;
  const canvas_responsive_boundary = 1000;
  const canvas_size_ratio =
    p.windowWidth < canvas_responsive_boundary ? 0.8 : 0.32;
  const canvas_width = p.windowWidth * canvas_size_ratio;
  const canvas_height = p.windowWidth * canvas_size_ratio;

  p.preload = () => {
    img = p.createImg("assets/img.png", "hand");
    img.style("bottom", `${(p.windowHeight - canvas_height) / 2 + 40}px`);
    img.style("right", `${(p.windowWidth - canvas_width) / 2 - 60}px`);
  };

  p.setup = () => {
    p.createCanvas(canvas_width, canvas_height);
    p.frameRate(7);
    img.style("width", `${p.width * 0.5}px`);
  };

  p.draw = () => {
    p.background("#9fa4ff");
    for (let i = 0; i <= p.windowWidth; i += arc_width) {
      for (let j = 0; j <= p.windowHeight; j += arc_width) {
        count = count + p.floor(p.random(4));

        p.noFill();
        p.strokeWeight(arc_stroke_weight);
        if (count % 4 === 0 || count % 4 === 1) {
          p.stroke("#ffe1e1");
          p.arc(i, j, arc_width, arc_width, p.PI / 2, p.PI);
          p.noStroke();
          p.fill("#ff2626");
          p.ellipse(i, j, ellipse_width);
        } else if (count % 4 === 2 || count % 4 === 3) {
          p.stroke("#ffe1e1");
          p.arc(i, j, arc_width, arc_width, p.PI + p.PI / 2, p.TWO_PI);
          p.noStroke();
          p.fill("#ffe1e1");
          p.ellipse(i, j, ellipse_width);
        }
      }
    }
  };

  p.windowResized = () => {
    const canvas_size_ratio =
      p.windowWidth < canvas_responsive_boundary ? 0.8 : 0.32;
    const canvas_width = p.windowWidth * canvas_size_ratio;
    const canvas_height = p.windowWidth * canvas_size_ratio;
    p.resizeCanvas(
      p.windowWidth * canvas_size_ratio,
      p.windowWidth * canvas_size_ratio
    );
    img.style("bottom", `${(p.windowHeight - canvas_height) / 2 + 40}px`);
    img.style("right", `${(p.windowWidth - canvas_width) / 2 - 60}px`);
    img.style("width", `${p.width * 0.5}px`);
  };
};

new p5(sketch);
