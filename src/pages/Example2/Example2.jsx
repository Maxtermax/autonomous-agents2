import { useEffect, useRef } from "react";
import SpaceShip from "@/utils/Entities/SpaceShip";
import Timelaps from "@/utils/Timelaps";
import Header from "@/components/Header/Header";
import Controls from "@/components/Controls/Controls";

class Universe extends Timelaps {
  constructor({ canvas, ctx }) {
    super({ canvas, ctx, FPS: 60 });
    this.play(this.render.bind(this));
    this.direction = 0;
    this.debug = false;
    this.frecuencia = 1.5;
    this.amplitude = 0.05;
  }

  preload() {
    let { canvas, ctx, debug } = this;
    this.spaceship = new SpaceShip({
      canvas,
      ctx,
      debug,
      x: -canvas.width / 2,
    });
    this.spaceship.normalX = 0;
  }

  update() {
    let { canvas, spaceship, amplitude, frecuencia } = this;
    if (spaceship.position.x - spaceship.width >= canvas.width / 2)
      spaceship.position.x = -(canvas.width / 2);
    spaceship.info.data = `deg: ${Math.floor(spaceship.angle)}, x: ${Math.floor(
      spaceship.position.x
    )}, y: ${Math.floor(spaceship.position.y)}`;
    spaceship.angle = Math.cos(this.direction) * frecuencia;
    spaceship.position.y += Math.cos(this.direction) * frecuencia;
    spaceship.position.x += 0.3;
    spaceship.normalX += 0.3;
    spaceship.render();
    this.direction -= amplitude;
  }

  render() {
    let { canvas, ctx, debug } = this;
    this.then = this.now - (this.delta % this.interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    ctx.translate(x, y);
    if (debug) this.drawCroos();
    this.update();
    ctx.closePath();
    ctx.restore();
  }

  drawCroos() {
    let { canvas, ctx } = this;
    ctx.strokeStyle = "white";
    ctx.moveTo(0, -(canvas.height / 2));
    ctx.lineTo(0, canvas.height / 2);
    ctx.moveTo(-(canvas.width / 2), 0);
    ctx.lineTo(canvas.width / 2, 0);
    ctx.stroke();
  }
}

function run() {
  const canvas = document.getElementById("lienzo");
  const ctx = canvas.getContext("2d");
  let space = new Universe({ canvas, ctx });
  space.preload();
  space.render();
  return space;
}

export default function Example2() {
  const spaceRef = useRef(null);
  useEffect(() => {
    spaceRef.current = run();
  }, []);

  const handleDebug = (event) => {
    spaceRef.current.debug = event.currentTarget.checked;
    spaceRef.current.spaceship.debug = spaceRef.current.debug;
  };

  const handleFrequency = (value) => {
    spaceRef.current.frecuencia = value;
  };

  const handleLength = (value) => {
    spaceRef.current.amplitude = value;
  };

  return (
    <div>
      <Header code="#" back="/example1" next="/example3" />
      <Controls
        onFrequency={handleFrequency}
        onLength={handleLength}
        onDebug={handleDebug}
      />
      <canvas
        style={{ background: "black" }}
        id="lienzo"
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    </div>
  );
}
