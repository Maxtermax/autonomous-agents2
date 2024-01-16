import { useEffect } from "react";
import Timelaps from "@/utils/Timelaps";
import Header from "@/components/Header/Header";
import SpaceShip from "@/utils/Entities/SpaceShip";

class Universe extends Timelaps {
  constructor({ canvas, ctx }) {
    super({ canvas, ctx });
    this.play(this.render.bind(this));
    this.direction = 0;
  }

  render() {
    let { canvas, ctx } = this;
    this.then = this.now - (this.delta % this.interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    ctx.translate(x, y);
    //ctx.scale(1, -1);
    this.drawCroos();
    this.update();
    ctx.closePath();
    ctx.restore();
  }

  drawCroos() {
    let { canvas, ctx } = this;
    ctx.strokeStyle = "red";
    ctx.moveTo(0, -(canvas.height / 2));
    ctx.lineTo(0, canvas.height / 2);
    ctx.moveTo(-(canvas.width / 2), 0);
    ctx.lineTo(canvas.width / 2, 0);
    ctx.stroke();
  }

  update() {
    let { spaceship } = this;
    spaceship.angle = Math.sin(this.direction);
    spaceship.acceleration.direction = spaceship.angle;
    spaceship.velocity.direction = spaceship.angle - 90;
    spaceship.render();
    this.direction += 0.08;
  }

  preload() {
    let { canvas, ctx } = this;
    this.spaceship = new SpaceShip({
      canvas,
      ctx,
      x: 0,
      y: 0,
      angle: 0,
      debug: true,
    });
  }
}

function run() {
  const canvas = document.getElementById("lienzo");
  const ctx = canvas.getContext("2d");
  let space = new Universe({ canvas, ctx });
  space.preload();
  space.render();
}

export default function Example1() {
  useEffect(() => {
    run();
  }, []);
  return (
    <div>
      <Header code="#" back="/" next="/example2" />
      <canvas
        style={{ background: "black" }}
        id="lienzo"
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
}
