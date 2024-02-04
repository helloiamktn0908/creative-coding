import "./globals";
import "p5/lib/addons/p5.sound";
import p5 from "p5";

let song: p5.SoundFile;
let analyzer: p5.Amplitude;
let circles: {
  x: number;
  y: number;
  radius: number;
  color: string;
}[] = [];

const color = ["rgb(148, 255, 47)", "rgb(83, 83, 83)", "#ffffff"];

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    song = p.loadSound("./assets/4SB.wav");
    // create a new Amplitude analyzer
    analyzer = new p5.Amplitude();
    // Patch the input to an volume analyzer
    analyzer.setInput(song);

    for (let i = 0; i < 200; i++) {
      circles.push({
        x: p.random(p.width),
        y: p.random(p.height),
        radius: p.random(50, 200),
        color: color[i % 3],
      });
    }
  };

  p.mousePressed = () => {
    if (song.isPlaying()) {
      song.stop();
    } else {
      song.play();
      song.loop();
    }
  };

  p.draw = () => {
    p.background("#969696");
    // Get the average (root mean square) amplitude
    let rms = analyzer.getLevel();

    for (let circle of circles) {
      p.fill(circle.color);
      p.stroke(0);
      p.ellipse(
        circle.x,
        circle.y,
        rms ? circle.radius + rms * p.random(circle.radius, 400) : circle.radius
      );
    }
  };
};

new p5(sketch);
