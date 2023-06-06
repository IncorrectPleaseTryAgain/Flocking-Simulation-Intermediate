class BoundaryRect {

    // x & y are the origin coordinates of the boundary - centered
    // w & h are the half width and height dimentions of the boundary
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    containsBoid(boid) {
        return (boid.pos.x >= (this.x - this.w) &&
            boid.pos.y >= (this.y - this.h) &&
            boid.pos.x <= (this.x + this.w) &&
            boid.pos.y <= (this.y + this.h));
    }

    overlaps(range) {
        return !(range.x - range.r > this.x + this.w ||
            range.x + range.r < this.x - this.w ||
            range.y - range.r > this.y + this.h ||
            range.y + range.r < this.y - this.h);
    }

    p5jsRender() {
        push();
        rectMode(CENTER);
        strokeWeight(2);
        stroke(BOUNDARY_COLOR.value);
        noFill();

        rect(this.x, this.y, this.w * 2, this.h * 2);
        pop();
    }
}