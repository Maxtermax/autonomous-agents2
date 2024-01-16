import { useEffect, useRef } from "react";
import Controls from "@/components/Controls/Controls";
import Circle from "@/components/agents/Circle";
import Vector from "@/components/agents/Vector";
import SpaceShip from "@/utils/Entities/SpaceShip";
import Header from "@/components/Header/Header";
import Timelaps from "@/utils/Timelaps";
import {
  calcCartesiano,
  getMousePos,
  radians2deg,
  vectorSubtraction,
} from "@/utils";

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

  separateSpaceships(current, spaceships = []) {
    let { ctx, canvas } = this;
    let sum = new Vector({
      ctx,
      canvas,
      magnitude: 1,
      direction: 0,
      color: "green",
      display: true,
    });
    let total = 0;
    let steer = current.forces[2];
    let desired = current.forces[1];
    let separate = steer && desired ? current.forces[3] : current.forces[1];
    if (separate) {
      separate.setMagnitude(separate.getMagnitude() - 0.2);
      if (separate.getMagnitude() <= 0) return;
    }
    for (let i = 0; i < spaceships.length; i++) {
      let spaceship = spaceships[i];
      if (spaceship.id === current) continue;
      current.addTarget(spaceship);
      if (current.isCollide(spaceship)) {
        let calc = current.calcSeparateForce(spaceship);
        sum.add(calc);
        total++;
      }
      current.targets.pop();
      current.segments.pop();
    }
    if (total) sum.split(total);
    sum.normalize();
    sum.mult(2.8);
    sum.translateX = current.position.x;
    sum.translateY = current.position.y;
    //sum.render();
    if (steer && desired) {
      current.forces[3] = sum;
    } else {
      current.forces[1] = sum;
    }
  }

  groupSpaceships(spaceships = []) {
    let { ctx, canvas, debug } = this;
    let sum = new Vector({
      ctx,
      canvas,
      magnitude: 1,
      direction: 0,
      color: "green",
    });
    for (let e = 0; e < spaceships.length; e++) {
      let spaceship = spaceships[e];
      //spaceship.color = 'red';
      let head = spaceship.position.clone({
        direction: spaceship.angle,
        display: true,
        magnitude: 1,
        color: "red",
      });
      head.translateX = spaceship.position.x;
      head.translateY = spaceship.position.y;
      head.render();
      sum.translateX += spaceship.position.x;
      sum.translateY += spaceship.position.y;
      sum.add(head);
    }
    sum.split(spaceships.length);
    sum.translateX /= spaceships.length;
    sum.translateY /= spaceships.length;
    ctx.beginPath();
    ctx.strokeStyle = "olive";
    ctx.arc(sum.translateX, -sum.translateY, 150, 0, Math.PI * 2);
    ctx.closePath();
    if (debug) sum.render();

    for (let e = 0; e < spaceships.length; e++) {
      let { magnitude, direction } = vectorSubtraction(
        { x: sum.translateX, y: sum.translateY },
        spaceships[e].position
      );
      let segment = new Vector({
        ctx,
        canvas,
        magnitude,
        direction: radians2deg(direction),
        color: "white",
      });
      segment.translateX = spaceships[e].position.x;
      segment.translateY = spaceships[e].position.y;
      if (debug) segment.render();
      if (segment.getMagnitude() <= 80) {
        let steer = spaceships[e].forces[1];
        let desired = spaceships[e].forces[2];
        if (desired && steer) {
          if (desired.getMagnitude() !== 0)
            desired.setMagnitude(desired.getMagnitude() - 1);
          if (steer.getMagnitude() !== 0)
            steer.setMagnitude(steer.getMagnitude() - 1);
        }
      } else {
        let desired = segment.clone();
        desired.normalize();
        desired.setMagnitude(50);
        //desired.mult(1.8);
        let velocity = spaceships[0].velocity;
        let s = vectorSubtraction(desired, velocity);
        let steer = new Vector({
          ctx,
          canvas,
          magnitude: s.magnitude,
          direction: radians2deg(s.direction),
          color: "green",
        });
        steer.limit(desired.getMagnitude() * 0.8);
        spaceships[e].forces[1] = steer;
        spaceships[e].forces[2] = desired;
      }
    }
  }

  pickOnRadius(r) {
    let result = {};
    let { ctx, canvas, spaceships } = this;
    for (let prev = 0; prev < spaceships.length; prev++) {
      let alreadIngroup = Object.keys(result).some((key) =>
        result[key].hasOwnProperty(spaceships[prev].id)
      );
      if (result.hasOwnProperty(spaceships[prev].id) || alreadIngroup) continue;
      let rSize = spaceships[prev].size + r;
      result[spaceships[prev].id] = {};
      for (let next = prev + 1; next < spaceships.length; next++) {
        if (
          spaceships[prev - 1] &&
          result[spaceships[prev - 1].id] &&
          result[spaceships[prev - 1].id].hasOwnProperty(spaceships[next].id)
        )
          continue;
        let { magnitude, direction } = vectorSubtraction(
          spaceships[next].position,
          spaceships[prev].position
        );
        let segment = new Vector({
          ctx,
          canvas,
          magnitude,
          direction: radians2deg(direction),
          color: "white",
          display: false,
        });
        segment.translateX = spaceships[prev].position.x;
        segment.translateY = spaceships[prev].position.y;
        if (this.debug) segment.render();
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.arc(
          spaceships[prev].position.x,
          -spaceships[prev].position.y,
          rSize,
          0,
          Math.PI * 2
        );
        if (this.debug) ctx.stroke();
        ctx.closePath();
        let overlaps = segment.getMagnitude() < rSize + spaceships[next].size;
        if (overlaps) {
          let self = result[spaceships[prev].id];
          let inOtherGroup = Object.keys(result).some((key) =>
            result[key].hasOwnProperty(spaceships[next].id)
          );
          if (inOtherGroup) continue;
          self[spaceships[next].id] = next;
        }
      }
      if (Object.keys(result[spaceships[prev].id]).length) {
        result[spaceships[prev].id].index = prev;
      } else {
        delete result[spaceships[prev].id];
      }
    }

    return result;
  }

  separateSteering(spaceships) {
    for (let spaceship of spaceships) {
      spaceship.separateFrom(spaceships);
    }
  }

  update() {
    let { canvas, debug, spaceships } = this;

    for (let spaceship of spaceships) {
      spaceship.debug = debug;
      let steer = spaceship.forces[1];
      let desired = spaceship.forces[2];
      if (desired && steer) {
        if (desired.getMagnitude() !== 0)
          desired.setMagnitude(desired.getMagnitude() - 1);
        if (steer.getMagnitude() !== 0)
          steer.setMagnitude(steer.getMagnitude() - 1);
      }

      if (spaceship.position.x > canvas.width / 2)
        spaceship.position.x = -canvas.width / 2;
      if (spaceship.position.x < -canvas.width / 2)
        spaceship.position.x = canvas.width / 2;
      if (spaceship.position.y > canvas.height / 2)
        spaceship.position.y = -canvas.height / 2;
      if (spaceship.position.y < -canvas.height / 2)
        spaceship.position.y = canvas.height / 2;
    }

    let groups = this.pickOnRadius(200);
    Object.keys(groups).forEach((group) => {
      let chunk = [];
      Object.keys(groups[group]).forEach((members) =>
        chunk.push(spaceships[groups[group][members]])
      );
      this.groupSpaceships(chunk);
    });
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

  generateSpaceships(data = {}, top = 3) {
    let { canvas, ctx, debug } = this;
    for (let i = 0; i < top; i++) {
      let { x = -canvas.width / 2 + 400, magnitude = 50 } = data;
      data.y += Math.random() * 4 + 50;
      let forces = [
        new Vector({
          canvas,
          ctx,
          direction: 0,
          magnitude: magnitude + Math.random() * 10,
          display: false,
        }),
      ];
      this.spaceships.push(
        new SpaceShip({
          ctx,
          x,
          y: data.y,
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
    this.generateSpaceships({ x: 100, y: 100, magnitude: 150 }, 5);
    this.generateSpaceships({ x: -100, y: -100, magnitude: 150 }, 5);

    canvas.addEventListener("mouseup", (e) => {
      let mousePos = getMousePos(canvas, e);
      let { x, y } = calcCartesiano(mousePos.x, mousePos.y, canvas);
      //let mag = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      //this.spaceships[0].position.setMagnitude(mag);
      //this.spaceships[0].position.setDirection(x, y);
      this.generateSpaceships({ x, y, magnitude: 150 }, 5);
    });

    /*
    this.generateTarget({ x: 0, y: 0 });
    canvas.addEventListener('mousemove', e => {
      let mousePos = getMousePos(canvas, e);
      let { x, y } = calcCartesiano(mousePos.x, mousePos.y, canvas);
      let mag = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      this.targets[0].position.setMagnitude(mag);
      this.targets[0].position.setDirection(x, y);
    })
    */
  }
}

function run() {
  const intViewportWidth = window.innerWidth;
  const intViewportHeight = window.innerHeight;
  const canvas = document.getElementById("lienzo");
  const ctx = canvas.getContext("2d");
  canvas.height = intViewportHeight;
  canvas.width = intViewportWidth;
  const space = new Universe({ canvas, ctx });
  space.preload();
  space.render();
  return space;
}

export default function Example8() {
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
      <Header title="Click on the canvas" code="#" back="/example7" />
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
