import p5 from "p5";

const sketch = (p: p5) => {
  const ellipse_width = 100;
  let count = 0;

  p.setup = () => {
    p.pixelDensity(4);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(7);
  };

  p.draw = () => {
    p.background("#14855E");
    p.stroke("#ffb5f0");
    p.strokeWeight(20);
    p.noFill();
    for (let i = 0; i <= p.windowWidth; i += ellipse_width) {
      for (let j = 0; j <= p.windowHeight; j += ellipse_width) {
        count = count + p.floor(p.random(4));

        if (count % 4 === 0) {
          // 下から左
          p.arc(i, j, ellipse_width, ellipse_width, p.PI / 2, p.PI);
        } else if (count % 4 === 1) {
          // 左から上
          p.arc(i, j, ellipse_width, ellipse_width, p.PI, p.PI + p.PI / 2);
        } else if (count % 4 === 2) {
          // 上から右
          p.arc(i, j, ellipse_width, ellipse_width, p.PI + p.PI / 2, p.TWO_PI);
        } else if (count % 4 === 3) {
          // 右から下
          p.arc(i, j, ellipse_width, ellipse_width, p.TWO_PI, p.PI / 2);
        }
      }
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(sketch);
