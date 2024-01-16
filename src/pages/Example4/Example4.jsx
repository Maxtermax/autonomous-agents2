import { useEffect, useRef } from "react";
import Controls from "@/components/Controls/Controls";
import Header from "@/components/Header/Header";
import Vector from "@/components/agents/Vector";
import SpaceShip from "@/utils/Entities/SpaceShip";
import Timelaps from "@/utils/Timelaps";

class Universe extends Timelaps {
  constructor({ canvas, ctx }) {
    super({ canvas, ctx, FPS: 60 });
    this.play(this.render.bind(this));
    this.debug = false;
    this.mass = 15;
    this.maxVelocity = 15;
    this.wave = 0;
  }

  preload() {
    let { canvas, ctx, debug, maxVelocity } = this;
    this.spaceships = [];
    for (let i = 0; i < 50; i++) {
      let x = -(canvas.width / 2) - Math.random() * 100;
      let y = i * 15 - 300;
      let mass = 100 + (i + 1) * (Math.random() * 100);
      let forces = [
        new Vector({
          ctx,
          canvas,
          magnitude: 150,
          color: "green",
          direction: 0,
        }),
      ];
      let spaceship = new SpaceShip({
        canvas,
        ctx,
        x,
        y,
        debug,
        forces,
        mass,
        maxVelocity,
      });
      this.spaceships.push(spaceship);
    }
  }

  update() {
    let { canvas, spaceships, wave, maxVelocity } = this;
    spaceships.forEach((spaceship) => {
      spaceship.maxVelocity = maxVelocity;
      spaceship.forces.forEach((force) => force.normalize());
      spaceship.info.data = `mass: ${Math.floor(
        spaceship.mass
      )}, x: ${Math.floor(spaceship.position.x)}, y: ${Math.floor(
        spaceship.position.y
      )}`;
      let offscreen =
        spaceship.position.x - spaceship.width >= canvas.width / 2;
      if (offscreen) {
        spaceship.acceleration.magnitude = 1;
        spaceship.position.x = -(canvas.width / 2);
      }
      if (spaceship.velocity.x > spaceship.maxVelocity) {
        spaceship.position.y += Math.sin(wave * 5) * 0.5;
        spaceship.angle = Math.sin(wave * 5) * 0.5;
      } else {
        spaceship.position.y += Math.sin(wave) * 0.2;
        spaceship.angle = Math.sin(wave) * 0.2;
      }

      this.wave -= 0.0008;
      spaceship.render();
    });
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
  const intViewportWidth = window.innerWidth;
  const intViewportHeight = window.innerHeight;
  const canvas = document.getElementById("lienzo");
  const ctx = canvas.getContext("2d");
  canvas.height = intViewportHeight;
  canvas.width = intViewportWidth;
  let space = new Universe({ canvas, ctx });
  space.preload();
  space.render();
  return space;
}

export default function Example4() {
  const spaceRef = useRef(null);
  useEffect(() => {
    spaceRef.current = run();
  }, []);

  const handleDebug = (event) => {
    spaceRef.current.debug = event.currentTarget.checked;
    spaceRef.current.spaceships.forEach(
      (spaceship) => (spaceship.debug = spaceRef.current.debug)
    );
  };

  const handleFPS = (value) => {
    spaceRef.current.FPS = value;
  };

  const handleMass = (value) => {
    spaceRef.current.maxVelocity = value;
  };

  return (
    <div>
      <Header code="#" back="/example3" next="/example5" />
      <Controls onMass={handleMass} onDebug={handleDebug} onFPS={handleFPS} />
      <canvas
        style={{ background: "black" }}
        id="lienzo"
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
}
