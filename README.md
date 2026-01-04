//
                                                  This Branch is Breaking Stuff

  
Director is becoming central librarian (it was always supposed to be).  I added methods to store&get Appearances, Parts and Polygons.  Also you can do it with JSON, which also how it has always supposed to be...
So I'm moving all the increasingly anachronistic and cumbersome binding/appending/adding logic into the Director, and simplifying how these work on the "per-thing" level, so the Director still works with them (and they can be used without it), but its a lot easier to just pre-load all of it with JSON.

// 

...

Its a basic 2D physic engines with collision detection/kinematics/forces/mouse detection/etc.

There are no dependecies, or libraries required to run this. It's just Javascript. 

