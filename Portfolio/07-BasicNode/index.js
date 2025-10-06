
console.log("Hello, world!");

import sw from 'star-wars-quotes';
console.log(sw())


import {randomSupervillain as supervillains} from 'supervillains'
import {randomSuperhero as superhero} from 'superheroes'
console.log(supervillains() ," vs ",superhero())

//read from input.txt file
import fs from 'fs';
const data = fs.readFileSync('./data/input.txt', 'utf8');
console.log(data);

