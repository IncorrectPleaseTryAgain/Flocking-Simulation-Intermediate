class Flock {
    constructor() {
        this.boids = [];
        this.capacity = CAPACITY_SLIDER.value;

        this.boundary = new BoundaryRect(width / 2, height / 2, width / 2, height / 2);
        this.quadtree = new Quadtree(this.boundary, this.capacity);

        for (let i = 0; i < NUM_BOIDS_SLIDER.value; i++) {
            this.boids[i] = new Boid();
            this.quadtree.insert(this.boids[i]);
        }
    }

    update() {

        if (USE_QUADTREE_CHECKBOX.checked) {
            let tempQuadtree = new Quadtree(this.boundary, this.capacity);
            this.boids.forEach(boid => {

                if (SHOW_RANGE_CHECKBOX.checked) {
                    boid.range.p5jsRender();
                }

                const BOIDS_IN_RANGE = this.quadtree.query(boid.range);

                boid.steer(BOIDS_IN_RANGE);
                boid.update();

                tempQuadtree.insert(boid);
                boid.range.update(boid.pos.x, boid.pos.y);
            })
            this.quadtree = {};
            this.quadtree = tempQuadtree;

        } else {
            let tempBoids = [];

            this.boids.forEach((boid, i) => {
                boid.steer(this.boids);
                boid.update();
                tempBoids[i] = boid;
            })

            this.boids = [];
            this.boids = tempBoids;
        }
    }

    updateBoidSize() {
        this.boids.forEach(boid => {
            boid.h = 2 * Number(BOID_SIZE_SLIDER.value);
            boid.w = 4 * Number(BOID_SIZE_SLIDER.value);
        })
    }

    updateRangeSize() {
        this.boids.forEach(boid => {
            boid.fovRadius = Number(RANGE_SIZE_SLIDER.value);
            boid.range = new RangeCircle(boid.pos.x, boid.pos.y, boid.fovRadius);
        })
    }

    updateMaxSpeed() {
        this.boids.forEach(boid => {
            boid.maxSpeed = Number(MAX_SPEED_SLIDER.value);
        })
    }

    updateForceSeperation() {
        this.boids.forEach(boid => {
            boid.forceSeperation = Number(SEPERATION_SLIDER.value);
        })
    }

    updateForceAlignment() {
        this.boids.forEach(boid => {
            boid.forceAlignment = Number(ALIGNMENT_SLIDER.value);
        })
    }

    updateForceCohesion() {
        this.boids.forEach(boid => {
            boid.forceCohesion = Number(COHESION_SLIDER.value);
        })
    }

    updateMultiplierDistance() {
        this.boids.forEach(boid => {
            boid.multiplierDistance = Number(DISTANCE_SLIDER.value);
        })
    }

    updateMultiplierHeading() {
        this.boids.forEach(boid => {
            boid.multiplierHeading = Number(HEADING_SLIDER.value);
        })
    }

    updateMultiplierPosition() {
        this.boids.forEach(boid => {
            boid.multiplierPosition = Number(POSITION_SLIDER.value);
        })
    }

    updateCapacity() {
        this.capacity = Number(CAPACITY_SLIDER.value);
    }


    insertBoids(numBoids) {
        for (let i = 0; i < numBoids; i++) {
            this.boids.push(new Boid());
        }
    }

    removeBoids(numBoids) {
        for (let i = 0; i < numBoids; i++) {
            this.boids.pop();
        }
    }

    p5jsRender() {
        this.boids.forEach(boid => boid.p5jsRender());

        if (SHOW_QUADTREE_CHECKBOX.checked) {
            this.quadtree.p5jsRender();
        }
    }
}