/*
* Author: 
Michael Steenkamp

* Date: 
31-05-2023

* Name: 
Flocking Simulation

* Description:
This program simulates the 'flocking' of birds in nature. Note: This is a very fundamental and root example and does not accurately depict the flocking behaviour that is seen in nature. The simulation also uses a quadtree data structure to increase performance.

This program is based on the infamous angorithm by Craig Reynolds.

* Sources:
https://www.youtube.com/watch?v=mhjuuHl6qHM
https://natureofcode.com/book/chapter-6-autonomous-agents/
https://www.red3d.com/cwr/boids/
https://en.wikipedia.org/wiki/Quadtree#:~:text=A%20quadtree%20is%20a%20tree,into%20four%20quadrants%20or%20regions
https://www.youtube.com/watch?v=OJxEcs0w_kE
https://www.youtube.com/watch?v=QQx_NmCIuCY&t=13s
https://www.youtube.com/watch?v=z0YFFg_nBjw&t=653s
*/

/* GLOBAL VARIABLES */
let flock = {};

const LOCAL_STORAGE_KEYS = {
  /* FORCE */
  KEY_SEPERATION: "force-seperation",
  KEY_ALIGNMENT: "force-alignment",
  KEY_COHESION: "force-chesion",

  /* MULTIPLIERS */
  KEY_DISTANCE: "multiplier-distance",
  KEY_HEADING: "multiplier-heading",
  KEY_POSITION: "multiplier-position",

  /* BOIDS */
  KEY_NUM_BOIDS: "num-boid",
  KEY_BOID_SIZE: "size-boid",
  KEY_RANGE_SIZE: "size-range",

  /* COLOR */
  KEY_BOID_COLOR: "boid-color",
  KEY_BACKGROUND_COLOR: "background-color",
  KEY_BOUNDARY_COLOR: "boundary-color",
  KEY_RANGE_COLOR: "range-color",

  /* OTHER */
  KEY_MAX_SPEED: "max-speed",
  KEY_CAPACITY: "capacity",
  KEY_SHOW_RANGE: "show-range",
  KEY_SHOW_QUADTREE: "show-quadtree"
}

/* HTML ELEMENTS */
/* FORCE */
const SEPERATION_SLIDER = document.querySelector('.input-force-seperation');
const ALIGNMENT_SLIDER = document.querySelector('.input-force-alignment');
const COHESION_SLIDER = document.querySelector('.input-force-cohesion');

const SEPERATION_VALUE = document.querySelector('.p-force-seperation');
const ALIGNMENT_VALUE = document.querySelector('.p-force-alignment');
const COHESION_VALUE = document.querySelector('.p-force-cohesion');

const DEFAULT_FORCE_SEPERATION = 0.55;
const DEFAULT_FORCE_ALIGNMENT = 0.5;
const DEFAULT_FORCE_COHESION = 0.5;

/* MULTIPLIERS */
const DISTANCE_SLIDER = document.querySelector('.input-multiplier-distance');
const HEADING_SLIDER = document.querySelector('.input-multiplier-heading');
const POSITION_SLIDER = document.querySelector('.input-multiplier-position');

const DISTANCE_VALUE = document.querySelector('.p-multiplier-distance');
const HEADING_VALUE = document.querySelector('.p-multiplier-heading');
const POSITION_VALUE = document.querySelector('.p-multiplier-position');

const DEFAULT_MULTIPLIER_DISTANCE = 1;
const DEFAULT_MULTIPLIER_HEADING = 1;
const DEFAULT_MULTIPLIER_POSITION = 1;

/* BOIDS */
const NUM_BOIDS_SLIDER = document.querySelector('.input-num-boids');

const BOID_SIZE_SLIDER = document.querySelector('.input-boid-size');
const RANGE_SIZE_SLIDER = document.querySelector('.input-range-size');

const NUM_BOIDS_VALUE = document.querySelector('.p-num-boids');

const BOID_SIZE_VALUE = document.querySelector('.p-boid-size');
const RANGE_SIZE_VALUE = document.querySelector('.p-range-size');

const DEFAULT_NUM_BOIDS = 500;
const DEFAULT_BOID_SIZE = 2;
const DEFAULT_RANGE_SIZE = 25;

/* COLOR */
const BOID_COLOR = document.querySelector('.input-color-boid');
const BACKGROUND_COLOR = document.querySelector('.input-color-background');
const BOUNDARY_COLOR = document.querySelector('.input-color-boundary');
const RANGE_COLOR = document.querySelector('.input-color-range');

const DEFAULT_RANGE_COLOR = "#ffffff";
const DEFAULT_BACKGROUND_COLOR = "#000000";
const DEFAULT_BOUNDARY_COLOR = "#ff0000";
const DEFAULT_BOID_COLOR = "#ffffff";

/* OTHER */
const MAX_SPEED_SLIDER = document.querySelector('.input-max-speed');
const MAX_SPEED_VALUE = document.querySelector('.p-max-speed');

const CAPACITY_SLIDER = document.querySelector('.input-capacity');
const CAPACITY_VALUE = document.querySelector('.p-capacity');

const SHOW_RANGE_CHECKBOX = document.querySelector('.input-show-range');
const SHOW_QUADTREE_CHECKBOX = document.querySelector('.input-show-quadtree');

const USE_QUADTREE_CHECKBOX = document.querySelector('.input-use-quadtree');

const RESET_SETTINGS_BUTTON = document.querySelector('.btn-reset-settings');

const FRAMERATE_VALUE = document.querySelector('.p-framerate');

const DEFAULT_MAX_SPEED = 3;
const DEFAULT_CAPACITY = 5;
const DEFAULT_SHOW_RANGE = false;
const DEFAULT_SHOW_QUADTREE = false;
const DEFAULT_USE_QUADTREE = true;



/* INITIALIZE HTML ELEMENTS | LOAD LOCAL STORAGE*/
function initializeHTML() {

  /* FORCE */
  initializeForce();

  /* MULTIPLIERS */
  initializeMultipliers();

  /* BOIDS */
  initializeBoids();

  /* COLOR */
  initializeColor();

  /* OTHER */
  initializeOther();


  function initializeForce() {
    const MIN_FORCE = 0;
    const MAX_FORCE = 5;
    const FORCE_INCREMENT = 0.01;

    SEPERATION_SLIDER.min = MIN_FORCE;
    SEPERATION_SLIDER.max = MAX_FORCE;
    SEPERATION_SLIDER.step = FORCE_INCREMENT;

    const VALUE_SEPERATION = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_SEPERATION) || DEFAULT_FORCE_SEPERATION;
    SEPERATION_SLIDER.value = VALUE_SEPERATION

    SEPERATION_VALUE.innerHTML = SEPERATION_SLIDER.value;

    ALIGNMENT_SLIDER.min = MIN_FORCE;
    ALIGNMENT_SLIDER.max = MAX_FORCE;
    ALIGNMENT_SLIDER.step = FORCE_INCREMENT;

    const VALUE_ALIGNMENT = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_ALIGNMENT) || DEFAULT_FORCE_ALIGNMENT;
    ALIGNMENT_SLIDER.value = VALUE_ALIGNMENT;

    ALIGNMENT_VALUE.innerHTML = ALIGNMENT_SLIDER.value;

    COHESION_SLIDER.min = MIN_FORCE;
    COHESION_SLIDER.max = MAX_FORCE;
    COHESION_SLIDER.step = FORCE_INCREMENT;

    const VALUE_COHESION = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_COHESION) || DEFAULT_FORCE_COHESION;
    COHESION_SLIDER.value = VALUE_COHESION;

    COHESION_VALUE.innerHTML = COHESION_SLIDER.value;
  }

  function initializeMultipliers() {
    const MIN_MULTIPLIER = 0;
    const MAX_MULTIPLIER = 5;
    const MULTIPLIER_INCREMENT = 0.01;

    DISTANCE_SLIDER.min = MIN_MULTIPLIER;
    DISTANCE_SLIDER.max = MAX_MULTIPLIER;
    DISTANCE_SLIDER.step = MULTIPLIER_INCREMENT;

    const VALUE_DISTANCE = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_DISTANCE) || DEFAULT_MULTIPLIER_DISTANCE;
    DISTANCE_SLIDER.value = VALUE_DISTANCE;

    DISTANCE_VALUE.innerHTML = DISTANCE_SLIDER.value;

    HEADING_SLIDER.min = MIN_MULTIPLIER;
    HEADING_SLIDER.max = MAX_MULTIPLIER;
    HEADING_SLIDER.step = MULTIPLIER_INCREMENT;

    const VALUE_HEADING = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_HEADING) || DEFAULT_MULTIPLIER_HEADING;
    HEADING_SLIDER.value = VALUE_HEADING;

    HEADING_VALUE.innerHTML = HEADING_SLIDER.value;

    POSITION_SLIDER.min = MIN_MULTIPLIER;
    POSITION_SLIDER.max = MAX_MULTIPLIER;
    POSITION_SLIDER.step = MULTIPLIER_INCREMENT;

    const VALUE_POSITION = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_POSITION) || DEFAULT_MULTIPLIER_POSITION;
    POSITION_SLIDER.value = VALUE_POSITION;

    POSITION_VALUE.innerHTML = POSITION_SLIDER.value;
  }

  function initializeBoids() {
    const MIN_NUM_BOIDS = 1;
    const MAX_NUM_BOIDS = 1000;
    const NUM_BOIDS_INCREMENT = 1;

    const MIN_SIZE_BOID = 1;
    const MAX_SIZE_BOID = 25;
    const SIZE_INCREMENT_BOID = 0.01;

    const MIN_SIZE_RANGE = 0;
    const MAX_SIZE_RANGE = 250;
    const SIZE_INCREMENT_RANGE = 1;

    NUM_BOIDS_SLIDER.min = MIN_NUM_BOIDS;
    NUM_BOIDS_SLIDER.max = MAX_NUM_BOIDS;
    NUM_BOIDS_SLIDER.step = NUM_BOIDS_INCREMENT;

    const VALUE_NUM_BOIDS = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_NUM_BOIDS) || DEFAULT_NUM_BOIDS;
    NUM_BOIDS_SLIDER.value = VALUE_NUM_BOIDS;

    NUM_BOIDS_VALUE.innerHTML = NUM_BOIDS_SLIDER.value;

    BOID_SIZE_SLIDER.min = MIN_SIZE_BOID;
    BOID_SIZE_SLIDER.max = MAX_SIZE_BOID;
    BOID_SIZE_SLIDER.step = SIZE_INCREMENT_BOID;

    const VALUE_BOID_SIZE = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_BOID_SIZE) || DEFAULT_BOID_SIZE;
    BOID_SIZE_SLIDER.value = VALUE_BOID_SIZE;

    BOID_SIZE_VALUE.innerHTML = BOID_SIZE_SLIDER.value;

    RANGE_SIZE_SLIDER.min = MIN_SIZE_RANGE;
    RANGE_SIZE_SLIDER.max = MAX_SIZE_RANGE;
    RANGE_SIZE_SLIDER.step = SIZE_INCREMENT_RANGE;

    const VALUE_RANGE_SIZE = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_RANGE_SIZE) || DEFAULT_RANGE_SIZE;
    RANGE_SIZE_SLIDER.value = VALUE_RANGE_SIZE;

    RANGE_SIZE_VALUE.innerHTML = RANGE_SIZE_SLIDER.value;


  }

  function initializeColor() {
    const VALUE_BOID_COLOR = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_BOID_COLOR) || DEFAULT_BOID_COLOR;
    BOID_COLOR.value = VALUE_BOID_COLOR;

    const VALUE_BACKGROUND_COLOR = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_BACKGROUND_COLOR) || DEFAULT_BACKGROUND_COLOR;
    BACKGROUND_COLOR.value = VALUE_BACKGROUND_COLOR;

    const VALUE_BOUNDARY_COLOR = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_BOUNDARY_COLOR) || DEFAULT_BOUNDARY_COLOR;
    BOUNDARY_COLOR.value = VALUE_BOUNDARY_COLOR;

    const VALUE_RANGE_COLOR = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_RANGE_COLOR) || DEFAULT_RANGE_COLOR;
    RANGE_COLOR.value = VALUE_RANGE_COLOR;
  }

  function initializeOther() {
    const MIN_MAX_SPEED = 0;
    const MAX_MAX_SPEED = 50;
    const MAX_SPEED_INCREMENT = 0.01;

    const MIN_CAPACITY = 1;
    const MAX_CAPACITY = 50;
    const CAPACITY_INCREMENT = 1;

    MAX_SPEED_SLIDER.min = MIN_MAX_SPEED;
    MAX_SPEED_SLIDER.max = MAX_MAX_SPEED;
    MAX_SPEED_SLIDER.step = MAX_SPEED_INCREMENT;

    const VALUE_MAX_SPEED = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_MAX_SPEED) || DEFAULT_MAX_SPEED;
    MAX_SPEED_SLIDER.value = VALUE_MAX_SPEED;

    MAX_SPEED_VALUE.innerHTML = MAX_SPEED_SLIDER.value;

    CAPACITY_SLIDER.min = MIN_CAPACITY;
    CAPACITY_SLIDER.max = MAX_CAPACITY;
    CAPACITY_SLIDER.step = CAPACITY_INCREMENT;

    const VALUE_CAPACITY = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_CAPACITY) || DEFAULT_CAPACITY;
    CAPACITY_SLIDER.value = VALUE_CAPACITY;

    CAPACITY_VALUE.innerHTML = CAPACITY_SLIDER.value;

    const VALUE_SHOW_RANGE = !!localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_SHOW_RANGE) || DEFAULT_SHOW_RANGE;
    SHOW_RANGE_CHECKBOX.checked = VALUE_SHOW_RANGE;

    const VALUE_SHOW_QUADTREE = !!localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_SHOW_QUADTREE) || DEFAULT_SHOW_QUADTREE;
    SHOW_QUADTREE_CHECKBOX.checked = VALUE_SHOW_QUADTREE;

    USE_QUADTREE_CHECKBOX.checked = DEFAULT_USE_QUADTREE;
  }

}

/* EVENT FUNCTIONS | SAVE LOCAL STORAGE */
/* FORCE */
SEPERATION_SLIDER.oninput = function () {
  localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_SEPERATION, SEPERATION_SLIDER.value);
  SEPERATION_VALUE.innerHTML = SEPERATION_SLIDER.value;
  flock.updateForceSeperation();
}

ALIGNMENT_SLIDER.oninput = function () {
  localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_ALIGNMENT, ALIGNMENT_SLIDER.value);
  ALIGNMENT_VALUE.innerHTML = ALIGNMENT_SLIDER.value;
  flock.updateForceAlignment();
}

COHESION_SLIDER.oninput = function () {
  localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_COHESION, COHESION_SLIDER.value);
  COHESION_VALUE.innerHTML = COHESION_SLIDER.value;
  flock.updateForceCohesion();
}

/* MULTIPLIERS */
DISTANCE_SLIDER.oninput = function () {
  localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_DISTANCE, DISTANCE_SLIDER.value);
  DISTANCE_VALUE.innerHTML = DISTANCE_SLIDER.value;
  flock.updateMultiplierDistance();
}

HEADING_SLIDER.oninput = function () {
  localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_HEADING, HEADING_SLIDER.value);
  HEADING_VALUE.innerHTML = HEADING_SLIDER.value;
  flock.updateMultiplierHeading();
}

POSITION_SLIDER.oninput = function () {
  localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_POSITION, POSITION_SLIDER.value);
  POSITION_VALUE.innerHTML = POSITION_SLIDER.value;
  flock.updateMultiplierPosition();
}

/* BOIDS */
NUM_BOIDS_SLIDER.oninput = function () {
  localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_NUM_BOIDS, NUM_BOIDS_SLIDER.value);

  const DIFF = NUM_BOIDS_SLIDER.value - Number(NUM_BOIDS_VALUE.innerHTML);

  DIFF > 0 ? flock.insertBoids(DIFF) : flock.removeBoids(abs(DIFF));

  NUM_BOIDS_VALUE.innerHTML = NUM_BOIDS_SLIDER.value;
}

BOID_SIZE_SLIDER.oninput = function () {
  localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_BOID_SIZE, BOID_SIZE_SLIDER.value);
  BOID_SIZE_VALUE.innerHTML = BOID_SIZE_SLIDER.value;
  flock.updateBoidSize();
}

RANGE_SIZE_SLIDER.oninput = function () {
  localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_RANGE_SIZE, RANGE_SIZE_SLIDER.value);
  RANGE_SIZE_VALUE.innerHTML = RANGE_SIZE_SLIDER.value;
  flock.updateRangeSize();
}

/* COLOR */
BOID_COLOR.oninput = function () {
  localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_BOID_COLOR, BOID_COLOR.value);
}

BACKGROUND_COLOR.oninput = function () {
  localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_BACKGROUND_COLOR, BACKGROUND_COLOR.value);
}

BOUNDARY_COLOR.oninput = function () {
  localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_BOUNDARY_COLOR, BOUNDARY_COLOR.value);
}

RANGE_COLOR.oninput = function () {
  localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_RANGE_COLOR, RANGE_COLOR.value);
}

/* OTHER */
MAX_SPEED_SLIDER.oninput = function () {
  localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_MAX_SPEED, MAX_SPEED_SLIDER.value);
  MAX_SPEED_VALUE.innerHTML = MAX_SPEED_SLIDER.value;
  flock.updateMaxSpeed();
}

CAPACITY_SLIDER.oninput = function () {
  localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_CAPACITY, CAPACITY_SLIDER.value);
  CAPACITY_VALUE.innerHTML = CAPACITY_SLIDER.value;
  flock.updateCapacity();
}

SHOW_RANGE_CHECKBOX.oninput = function () {
  SHOW_RANGE_CHECKBOX.checked ?
    localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_SHOW_RANGE, "true") : localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_SHOW_RANGE, "");
}

SHOW_QUADTREE_CHECKBOX.oninput = function () {
  SHOW_QUADTREE_CHECKBOX.checked ?
    localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_SHOW_QUADTREE, "true") : localStorage.setItem(LOCAL_STORAGE_KEYS.KEY_SHOW_QUADTREE, "");
}

USE_QUADTREE_CHECKBOX.oninput = function () {
  if (!USE_QUADTREE_CHECKBOX.checked) {
    SHOW_RANGE_CHECKBOX.checked = false;
    SHOW_QUADTREE_CHECKBOX.checked = false;
  } else {
    SHOW_RANGE_CHECKBOX.checked = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_SHOW_RANGE);
    SHOW_QUADTREE_CHECKBOX.checked = localStorage.getItem(LOCAL_STORAGE_KEYS.KEY_SHOW_QUADTREE);;
  }
}

RESET_SETTINGS_BUTTON.onclick = function () {
  localStorage.clear();
  initializeHTML();
  flock = new Flock();
}

function setup() {

  const DIV_P5 = document.querySelector('.div-p5');
  createCanvas(500, 500).parent(DIV_P5);

  setInterval(() => { FRAMERATE_VALUE.innerHTML = frameRate().toFixed(0); }, 250);

  initializeHTML();

  /* CREATE FLOCK */
  flock = new Flock();
}

function draw() {
  background(BACKGROUND_COLOR.value);

  flock.p5jsRender();
  flock.update();
}

