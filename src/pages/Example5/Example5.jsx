import { useEffect, useRef } from "react";
import Controls from "@/components/Controls/Controls";
import Circle from '@/components/agents/Circle'
import Header from "@/components/Header/Header";
import Timelaps from "@/utils/Timelaps";
import { calcCartesiano, getMousePos } from "@/utils";

class Universe extends Timelaps {
  constructor({ canvas, ctx }) {
    super({ canvas, ctx });
    this.play(this.render.bind(this));
    this.debug = false;
    this.points = [];
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

  update() {
    let { debug, mouse, targets } = this;
    targets.forEach((target) => {
      target.debug = debug;
      let collide = mouse.isCollide(target);
      if (collide) {
        target.color = "red";
        target.stroke = false;
      } else {
        target.color = "blue";
        target.stroke = true;
      }
      target.render();
    });
    mouse.debug = debug;
    mouse.render();
  }

  generateTarget({ x, y, color = "blue" }) {
    let { ctx, canvas, debug, mouse, targets } = this;
    console.log(color);
    let point = new Circle({
      stroke: true,
      ctx,
      canvas,
      x,
      y,
      size: 25,
      debug,
      color,
    });
    mouse.joinCircles(point);
    mouse.targets.push(point);
    targets.push(point);
  }

  generatePattern() {
    let space = 2;
    for (let i = 0; i < this.canvas.width / 2 / 50; i++) {
      let pull = -(this.canvas.width / 2) / 2;
      let x = (i * 50 + pull) * space;
      let y = Math.sin(i) * 100;
      this.generateTarget({ x, y });
    }
  }

  preload() {
    let { canvas, ctx, debug } = this;
    this.targets = [];
    this.mouse = new Circle({
      stroke: true,
      targets: [...this.targets],
      ctx,
      canvas,
      x: 0,
      y: 0,
      size: 15,
      debug,
      color: "olive",
    });
    canvas.addEventListener("mousemove", (e) => {
      let mousePos = getMousePos(canvas, e);
      let { x, y } = calcCartesiano(mousePos.x, mousePos.y, canvas);
      this.mouse.position.x = x;
      this.mouse.position.y = y;
    });
    this.generatePattern();
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

export default function Example5() {
  const spaceRef = useRef(null);
  useEffect(() => {
    spaceRef.current = run();
  }, []);

  const handleDebug = (event) => {
    spaceRef.current.debug = event.currentTarget.checked;
  };

  return (
    <div>
      <Header code="#" back="/example4" next="/example6" />
      <Controls onDebug={handleDebug} />
      <canvas
        style={{ background: "black" }}
        id="lienzo"
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
}
