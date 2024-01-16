import { useEffect, useRef } from "react";
import Controls from "@/components/Controls/Controls";
import Circle from "@/components/agents/Circle";
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
  }

  render() {
    let { canvas, ctx, debug, spaceship, targets } = this;
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
    spaceship.render();
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
    let { debug, targets, spaceship } = this;
    spaceship.debug = debug;
    let s = 0;
    let smaller;
    targets.forEach((target, index) => {
      target.debug = debug;
      if (target.size > s) {
        s = target.size;
        smaller = index;
      }
    });

    if (targets.length) {
      spaceship.seek(targets[smaller].id, (segmentIndex, targetIndex) => {
        spaceship.segments.splice(segmentIndex, 1);
        spaceship.targets.splice(targetIndex, 1);
        targets.splice(targetIndex, 1);
      });
    }
  }

  generateTarget({ x, y }) {
    let { ctx, canvas, debug, spaceship, targets } = this;
    let size = 10 + Math.random() * 100;
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
    spaceship.addTarget(target);
  }

  preload() {
    let { canvas, ctx } = this;
    this.spaceship = new SpaceShip({ ctx, mass: 12, canvas, maxVelocity: 50 });
    canvas.addEventListener("mouseup", (e) => {
      let mousePos = getMousePos(canvas, e);
      let { x, y } = calcCartesiano(mousePos.x, mousePos.y, canvas);
      this.generateTarget({ x, y });
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

export default function Example6() {
  const spaceRef = useRef(null);
  useEffect(() => {
    spaceRef.current = run();
  }, []);

  const handleDebug = (event) => {
    spaceRef.current.debug = event.currentTarget.checked;
    spaceRef.current.spaceship.debug = spaceRef.current.debug;
  };

  const handleFPS = (value) => {
    spaceRef.current.FPS = value;
  };

  return (
    <div>
      <Header
        title="Click on the canvas"
        code="#"
        back="/example5"
        next="/example7"
      />
      <Controls onDebug={handleDebug} onFPS={handleFPS} />
      <canvas
        style={{ background: "black" }}
        id="lienzo"
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
}
