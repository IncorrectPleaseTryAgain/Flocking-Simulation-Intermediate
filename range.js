class RangeCircle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    containsBoid(boid) {
        return (boid.pos.x >= (this.x - this.r) &&
            boid.pos.y >= (this.y - this.r) &&
            boid.pos.x <= (this.x + this.r) &&
            boid.pos.y <= (this.y + this.r));
    }

    update(x, y) {
        this.x = x;
        this.y = y;
    }

    p5jsRender() {
        push();
        strokeWeight(2);
        stroke(RANGE_COLOR.value + "40");
        noFill();
        circle(this.x, this.y, this.r * 2);
        pop();
    }
}