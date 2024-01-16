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
    this.left_force = 50;
    this.right_force = 50;
  }

  preload() {
    let { canvas, ctx, debug } = this;
    let forces = [
      new Vector({
        ctx,
        canvas,
        magnitude: 50,
        color: "blue",
        direction: 0,
        id: "right_force",
      }),
      new Vector({
        ctx,
        canvas,
        magnitude: 50,
        color: "red",
        direction: 180,
        id: "left_force",
      }),
      new Vector({
        ctx,
        canvas,
        magnitude: 50,
        color: "green",
        direction: 90,
        id: "top_force",
      }),
      new Vector({
        ctx,
        canvas,
        magnitude: 50,
        color: "purple",
        direction: 270,
        id: "bottom_force",
      }),
    ];
    this.spaceship = new SpaceShip({
      speedUp: false,
      canvas,
      ctx,
      debug,
      forces,
      mass: 1,
      maxVelocity: 10,
    });
  }

  update() {
    let { spaceship } = this;
    spaceship.render();
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
    //ctx.scale(1, -1);
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

export default function Example3() {
  const spaceRef = useRef(null);
  useEffect(() => {
    spaceRef.current = run();
  }, []);

  const handleBottomForce = (value) => {
    const force = spaceRef.current.spaceship.forces[3];
    force.setMagnitude(value);
  };

  const handleTopForce = (value) => {
    const force = spaceRef.current.spaceship.forces[2];
    force.setMagnitude(value);
  };

  const handleLeftForce = (value) => {
    const force = spaceRef.current.spaceship.forces[1];
    force.setMagnitude(value);
  };

  const handleRightForce = (value) => {
    const force = spaceRef.current.spaceship.forces[0];
    force.setMagnitude(value);
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
      <Header code="#" back="/example2" next="/example4" />
      <Controls
        onTopForce={handleTopForce}
        onBottomForce={handleBottomForce}
        onRightForce={handleRightForce}
        onLeftForce={handleLeftForce}
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
