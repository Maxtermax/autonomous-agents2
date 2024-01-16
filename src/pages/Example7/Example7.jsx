import { useEffect, useRef } from "react";
import Controls from "@/components/Controls/Controls";
import Circle from "@/components/agents/Circle";
import Vector from "@/components/agents/Vector";
import SpaceShip from "@/utils/Entities/SpaceShip";
import Header from "@/components/Header/Header";
import Timelaps from "@/utils/Timelaps";
import { calcCartesiano, getMousePos } from "@/utils";

class Universe extends Timelaps {
  constructor({ canvas, ctx }) {
    super({ canvas, ctx });
    this.play(this.render.bind(this));
    this.debug = false;
    this.targets = [];
    this.spaceships = [];
  }

  render() {
    let { canvas, ctx, debug, spaceships, targets } = this;
    this.then = this.now - (this.delta % this.interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    ctx.translate(x, y);
    if (debug) this.drawCroos();
    this.update();
    for (let spaceship of spaceships) spaceship.render();
    targets.forEach((target) => target.render());
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

  update() {
    let { canvas, debug, targets, spaceships } = this;
    for (let spaceship of spaceships) {
      spaceship.debug = debug;
      if (spaceship.position.x > canvas.width / 2)
        spaceship.position.x = -canvas.width / 2;
      if (spaceship.position.x < -canvas.width / 2)
        spaceship.position.x = canvas.width / 2;
      if (spaceship.position.y > canvas.height / 2)
        spaceship.position.y = -canvas.height / 2;
      if (spaceship.position.y < -canvas.height / 2)
        spaceship.position.y = canvas.height / 2;
      for (let target of targets) {
        spaceship.fleeSteering(target.id, (steer, desired) => {
          spaceship.forces[1] = steer;
          spaceship.forces[2] = desired;
        });
      }
    }
  }

  generateTarget({ x, y }) {
    let { ctx, canvas, debug, spaceships, targets } = this;
    let size = 50;
    let target = new Circle({
      stroke: true,
      ctx,
      canvas,
      x,
      y,
      size,
      debug,
      color: "red",
    });
    targets.push(target);
    for (let spaceship of spaceships) spaceship.addTarget(target);
  }

  generateSpaceships() {
    let { canvas, ctx, debug } = this;
    let top = 10;
    for (let i = 0; i < top; i++) {
      let forces = [
        new Vector({
          canvas,
          ctx,
          direction: 0,
          magnitude: 100 + Math.random() * 10,
          display: false,
        }),
      ];
      let x = -canvas.width / 2 - 25 + Math.random() * 100;
      let y = 100 + i * 10 - 25 + Math.random() * 100;
      this.spaceships.push(
        new SpaceShip({
          ctx,
          x,
          y,
          debug,
          canvas,
          forces,
          maxForce: 0.6,
          fleeForce: 60,
        })
      );
    }
  }
  preload() {
    let { canvas } = this;
    this.generateSpaceships();
    this.generateTarget({ x: 0, y: 0 });
    canvas.addEventListener("mousemove", (e) => {
      let mousePos = getMousePos(canvas, e);
      let { x, y } = calcCartesiano(mousePos.x, mousePos.y, canvas);
      let mag = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      this.targets[0].position.setMagnitude(mag);
      this.targets[0].position.setDirection(x, y);
    });
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

export default function Example7() {
  const spaceRef = useRef(null);
  useEffect(() => {
    spaceRef.current = run();
  }, []);

  const handleMaxForce = (value) => {
    for (let spaceship of this.spaceships) spaceship.maxForce = value;
  };

  const handleMaxVelocity = (value) => {
    for (let spaceship of this.spaceships) spaceship.maxVelocity = value;
  };

  const handleDebug = (event) => {
    spaceRef.current.debug = event.currentTarget.checked;
    spaceRef.current.spaceship.debug = spaceRef.current.debug;
  };

  const handleFPS = (value) => {
    spaceRef.current.FPS = value;
  };

  return (
    <div>
      <Header code="#" back="/example6" next="/example8" />
      <Controls
        onMaxForce={handleMaxForce}
        onMaxVelocity={handleMaxVelocity}
        onDebug={handleDebug}
        onFPS={handleFPS}
      />
      <canvas
        style={{ background: "black" }}
        id="lienzo"
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
}
