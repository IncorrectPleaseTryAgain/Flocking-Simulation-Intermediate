class Boid {
    constructor() {
        this.minVel = 0.5;
        this.maxVel = 5;
        this.maxSpeed = Number(MAX_SPEED_SLIDER.value);

        this.fovRadius = Number(RANGE_SIZE_SLIDER.value);

        this.forceSeperation = Number(SEPERATION_SLIDER.value);
        this.forceAlignment = Number(ALIGNMENT_SLIDER.value)
        this.forceCohesion = Number(COHESION_SLIDER.value);

        this.multiplierDistance = Number(DISTANCE_SLIDER.value);
        this.multiplierHeading = Number(HEADING_SLIDER.value);
        this.multiplierPosition = Number(POSITION_SLIDER.value);


        this.w = 4 * Number(BOID_SIZE_SLIDER.value);
        this.h = 2 * Number(BOID_SIZE_SLIDER.value);


        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D().setMag(random(this.minVel, this.maxVel));
        this.acc = createVector();

        this.range = new RangeCircle(this.pos.x, this.pos.y, this.fovRadius);
    }

    update() {
        this.vel.add(this.acc).limit(this.maxSpeed);
        this.pos.add(this.vel);
        wrapPos(this.pos);

        this.acc = createVector();

        function wrapPos(pos) {
            if (pos.x < 0) {
                pos.x = width;
            }
            if (pos.x > width) {
                pos.x = 0;
            }

            if (pos.y < 0) {
                pos.y = height;
            }
            if (pos.y > height) {
                pos.y = 0;
            }
        }
    }

    steer(boidsInRange) {
        let averageDistance = createVector();
        let averageHeading = createVector();
        let averagePosition = createVector();

        let numLocalFlockmates = 0;

        boidsInRange.forEach((boid) => {

            const DISTANCE = dist(this.pos.x, this.pos.y, boid.pos.x, boid.pos.y);

            if (boid != this && DISTANCE <= this.fovRadius) {

                averageDistance.add((p5.Vector.sub(this.pos, boid.pos).div(pow(DISTANCE, 2))));
                averageHeading.add(boid.vel);
                averagePosition.add(boid.pos);
                numLocalFlockmates++;
            }
        })

        if (numLocalFlockmates) {

            //Separation
            averageDistance.div(numLocalFlockmates);
            averageDistance.setMag(this.maxSpeed);
            averageDistance.sub(this.vel);
            averageDistance.limit(this.forceSeperation);

            //Alignment
            averageHeading.div(numLocalFlockmates);
            averageHeading.setMag(this.maxSpeed);
            averageHeading.sub(this.vel);
            averageHeading.limit(this.forceAlignment);

            //Cohesion
            averagePosition.div(numLocalFlockmates);
            averagePosition.sub(this.pos);
            averagePosition.setMag(this.maxSpeed);
            averagePosition.sub(this.vel);
            averagePosition.limit(this.forceCohesion);
        }

        averageDistance.mult(this.multiplierDistance);
        averageHeading.mult(this.multiplierHeading);
        averagePosition.mult(this.multiplierPosition);

        this.acc.add(averageDistance).add(averageHeading).add(averagePosition);
    }

    p5jsRender() {

        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());

        strokeWeight(1);
        stroke(0, 50);
        fill(BOID_COLOR.value);
        triangle(-this.w, this.h, -this.w, -this.h, this.w, 0);
        pop();

        if (SHOW_RANGE_CHECKBOX.checked) {
            this.range.p5jsRender();
        }
    }
}