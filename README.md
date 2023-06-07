# Flocking-Simulation-Intermediate
Intermediate flocking simulation which uses a quadtree data structure to increase performance.

---

# Contents

+ [Introduction](#introduction)
+ [How It Works](#how-it-works)
+ [Program Architecture](#program-architecture)
+ [Previews](#previews)
+ [References](#references)

---

# Introduction

This project originated from me watching a YouTube video [[1]](#ref-fs) by The Coding Train [[2]](#ref-ct). In this video the creator of The Coding Train demonstrates the implementation of a 'flocking simulation' using 
<a href="https://www.javascript.com/">JavaScript</a>
and the 
<a href="https://p5js.org/">p5.js</a>
library. The program simulates a sort of flocking behaviour [[3]](#ref-fb) that can be seen in nature. I used The Coding Train's video as a guide to the implementation of this specific simulation; however, I also used sources such as an article written by Craig Reynolds [[4]](#ref-cra). The program also uses a quadtree data structure [[5]](#ref-qt) to increase performance. ([Quadtree Repository](https://github.com/IncorrectPleaseTryAgain/Quadtree))

---

# How It Works

The program consists of a 'Flock' which holds a list of 'boids'. The boids, in our case, are the white triangles, see [image preview](#previews). Each boids behaviour is guided by three simple rules. 

### Rules
+ "Separation: steer to avoid crowding local flockmates". [[4]](#ref-cra)
+ "Alignment: steer towards the average heading of local flockmates". [[4]](#ref-cra)
+ "Cohesion: steer to move toward the average position of local flockmates". [[4]](#ref-cra)

The first rule (Seperation) states that each boid should steer away from any other boid that is in its local area if the distance between them are too small.
The seconds rule (Alignment) states that each boid should orient itself to the average orientation of the boids in its local area.
The third rule (Cohesion) states that each boid should steer towards the average location of the boids in its local area.

If each boid follows these three rules then a flocking behaviour can be observed.

For a more detailed explanation on the mechanics of the simulation please read Craig Reynolds [article](https://www.red3d.com/cwr/boids/).

---

# Program Architecture

This will be an explanation of the programs structure as well as give an explanation to some methods (<a href="https://www.javascript.com/">JavaScript</a> & <a href="https://p5js.org/">p5.js</a>).
<br>
Note: this explanation does not cover quadtree - For an explanation of the quadtree please go to [my repository](https://github.com/IncorrectPleaseTryAgain/Quadtree).

## Structure
The simulation consists of two main classes, the 'Flock' and the 'Boid'. <br>
The flock stores a list of boids and the quadtree <br>
The boid stores its velocity, position and range (area of local flockmates). It has two function, one to calculate its steering force (steer) and another to apply that steering force (update). <br>

## Explanations
#### Steering (parameters: list of boids in range) <br>
This method is used to calculate the separation, alignment, and cohesion forces. It then adds those forces to get the final steering force. <br>

```
Separation Force:

A = The average distance between the current boid and all the boids in its range.
B = A with magnitude of max speed.
C = B subtract current velocity.
Separation Force = C with a limit at the max separation force.
```
<br>

```
Alignment Force:

A = The average velocity of all the boids in its range.
B = A with magnitude of max speed.
C = B substract current velocity.
Alignment Force = C with a limit at the max alignment force.
```
<br>

```
Cohesion Force:

A = The average position of all the boids in its range.
B = A subtract its current position.
C = B with magnitude of max speed.
D = C subtract current velocity.
Cohesion Force = D with a limit at the max cohesion force.
```
<br>
Finally all three these force are added to get the final steering force.

#### Update (parameters: list of boids in range) <br>
This method is used to apply the steering force to its current velocity. <br>

```
Velocity = (current velocity plus steering force) limited to the max speed.
Position = current position plus velocity
If boids hits edge then wrap to other side.
```
<br>
These two methods are then repeatedly called each frame.
    
       
---

# Previews
<p align="center">
  <img src="https://github.com/IncorrectPleaseTryAgain/Flocking-Simulation-Intermediate/assets/99939034/64a8a21c-2e1b-4a6f-99fe-7dbd135d8ad2" alt="imgage preview" width="800px" height="450px" />
</p>

## <p align="center"><a href="https://www.youtube.com/watch?v=5ZvgPMOR3qY&t=28s" >Video Preview</a></p>

---

# References
<p><a name="ref-fs">[1]</a> The Coding Train. (2018). Coding Challenge #124: Flocking Simulation 
  <a href="https://www.youtube.com/watch?v=mhjuuHl6qHM&t=2111s">link</a></p>
  
<p><a name="ref-ct">[2]</a> The Coding Train. (2023). 
  <a href="https://www.youtube.com/@TheCodingTrain">link</a></p>
  
<p><a name="ref-fb">[3]</a> Sinkovits, D. (2006). Flocking Behavior. 
  <a href="https://guava.physics.uiuc.edu/~nigel/courses/569/Essays_Spring2006/files/Sinkovits.pdf">link</a></p>
  
<p><a name="ref-cra">[4]</a> Boids (Flocks, Herds, and Schools: a Distributed Behavioral Model). (2023). Red3d.com. 
  <a href="https://www.red3d.com/cwr/boids/">link</a></p>
  
<p><a name="ref-qt">[5]</a> Wikipedia Contributors. (2023, April 10). Quadtree. Wikipedia.  
  <a href="https://en.wikipedia.org/wiki/Quadtree">link</a></p>
  
<p><a name="ref-qt-3">[6]</a> The Coding Train. (2018). Coding Challenge #98.3: Quadtree Collisions - Part 3 
  <a href="https://www.youtube.com/watch?v=z0YFFg_nBjw&t=657s">link</a></p>

[back to top](#flocking-simulation-intermediate)
