class Quadtree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;

        this.boidsInBound = [];
        this.isSubDivided = false;
    }

    insert(boid) {

        if (!this.boundary.containsBoid(boid)) {
            return false;
        }

        if (this.boidsInBound.length < this.capacity) {
            this.boidsInBound.push(boid);
            return true;
        } else {
            if (!this.isSubDivided) {
                this.subDivide();
            }

            if (this.northEastQuadrant.insert(boid) ||
                this.northWestQuadrant.insert(boid) ||
                this.southEastQuadrant.insert(boid) ||
                this.southWestQuadrant.insert(boid)) {

                return true;

            } else {
                console.log(`Failed: Inserting boid | quadtree.js line: 24 - 30\nboid Pos: (${boid.pos.x} , ${boid.pos.y})`);
                return false;
            }
        }
    }

    subDivide() {

        this.northEastQuadrant =
            new Quadtree(
                new BoundaryRect(
                    this.boundary.x - (this.boundary.w / 2),
                    this.boundary.y + (this.boundary.h / 2),
                    this.boundary.w / 2, this.boundary.h / 2),
                this.capacity);

        this.northWestQuadrant =
            new Quadtree(
                new BoundaryRect(
                    this.boundary.x + (this.boundary.w / 2),
                    this.boundary.y + (this.boundary.h / 2),
                    this.boundary.w / 2, this.boundary.h / 2),
                this.capacity);

        this.southEastQuadrant =
            new Quadtree(
                new BoundaryRect(
                    this.boundary.x - (this.boundary.w / 2),
                    this.boundary.y - (this.boundary.h / 2),
                    this.boundary.w / 2, this.boundary.h / 2),
                this.capacity);

        this.southWestQuadrant =
            new Quadtree(
                new BoundaryRect(
                    this.boundary.x + (this.boundary.w / 2),
                    this.boundary.y - (this.boundary.h / 2),
                    this.boundary.w / 2, this.boundary.h / 2),
                this.capacity);

        this.isSubDivided = true;
    }

    query(range, boidsInRange = []) {

        if (!this.boundary.overlaps(range)) {
            return boidsInRange;
        }

        this.boidsInBound.forEach((boid) => {
            if (range.containsBoid(boid)) {
                boidsInRange.push(boid);
            }
        })

        if (this.isSubDivided) {
            this.northEastQuadrant.query(range, boidsInRange);
            this.northWestQuadrant.query(range, boidsInRange);
            this.southEastQuadrant.query(range, boidsInRange);
            this.southWestQuadrant.query(range, boidsInRange);
        }

        return boidsInRange;
    }



    p5jsRender() {

        this.boundary.p5jsRender();

        if (this.isSubDivided) {
            this.northEastQuadrant.p5jsRender();
            this.northWestQuadrant.p5jsRender();
            this.southEastQuadrant.p5jsRender();
            this.southWestQuadrant.p5jsRender();
        }
    }
}