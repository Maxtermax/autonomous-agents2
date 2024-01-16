import Vector from '@/components/agents/Vector.js'
import SpaceShip from './SpaceShip.js'
import { guid, vectorSubtraction } from '@/utils/index.js'

export default class Hunter extends SpaceShip {
  constructor({ ctx, speedUp = true, stroke = true,  size = 20, maxVelocity = 5, maxForce = 0.5, targets = [], width = 20, height = 20, canvas, debug = false, mass = 40, forces = [], x = 0, y = 0, angle = 0, velocity = 0, acceleration = 0, color = 'white', id = guid(), display = true }) {
    super({ ctx, speedUp, stroke, size, maxVelocity, maxForce, targets, width, height, canvas, debug, mass, forces, x, y, angle, velocity, acceleration, color, id, display});
  }

  seekSteering(id, result, done) {
    let { velocity, canvas, ctx, maxForce } = this;
    let segment = this.getSegment(id);
    let target = this.getTarget(id);
    if (segment && target) {
      this.angle = segment.direction;
      if (this.isCollide(target)) {
        let segmentIndex = this.getSegmentIndex(id);
        let targetIndex = this.getTargetIndex(id);
        if (done) {
          done(segmentIndex, targetIndex);
        }
      } else {
        let desired = segment.clone({ color: 'white', display: true });
        //desired.render();
        desired.mult(5);
        let { magnitude, direction } = vectorSubtraction(desired, velocity);
        let steer = new Vector({ ctx, canvas, magnitude, direction, color: 'green' });        
        steer.limit(desired.getMagnitude() * maxForce);
        if (result) result(steer, desired);
      }
    }
  }

  draw() {
    let { angle, width, height, position, ctx, color, acceleration, velocity, info, debug } = this;
    let { x, y } = position;
    ctx.save();//save angle
    ctx.beginPath();
    ctx.scale(1, -1);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';

    ctx.translate((width / 2) / 2, 0);
    ctx.lineTo(-(width / 2), height / 2);
    ctx.lineTo(width / 2, -(height / 2) + height / 2);
    ctx.lineTo(-(width / 2), -height / 2);

    ctx.lineTo(-(width / 2), height / 2);
    ctx.lineTo(width / 2, -(height / 2) + height / 2);
    ctx.lineTo(-(width / 2), -height / 2);
    ctx.lineTo(-width, -(height / 2) + height / 2);
    ctx.lineTo(-(width / 2), height / 2);
    
    ctx.lineTo(-(width / 2), height / 2);
    ctx.lineTo(width / 2, -(height / 2) + height / 2);
    ctx.lineTo(-(width / 2), -height / 2);
    ctx.lineTo(-(width / 8), (-(height / 2) + height / 2));
    ctx.moveTo(-(width / 2), height / 2);
    ctx.lineTo(-(width / 8), (-(height / 2) + height / 2));
    ctx.fill();
    ctx.closePath();
    ctx.restore();
    acceleration.render();
    velocity.render();
    position.render();
    if (debug) this.drawShildForce();
  }

}

