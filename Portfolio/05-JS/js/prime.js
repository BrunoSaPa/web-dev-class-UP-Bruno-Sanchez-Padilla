/*
    Prime Factorization - Have the user enter a number and find
    all Prime Factors (if there are any) and display them.
*/


var getPrimeFactors = function (n) {
  "use strict";

  console.log("getPrimeFactors called with " + n);

  function isPrime(n) {
    var i;

    for (i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        return false;
      }
    }
    return true;
  }

  var i, sequence = [];

  //the instructions form the readme where a little different from this solution, but ths solution
  //was reviewed in my data structures class and it is correct
  for (i = 2; i <= n; i++) {
    if (n % i === 0 && isPrime(i)) {
      sequence.push(i);
    }
  }
    document.getElementById("numDisplay").innerText = n;
    document.getElementById("factorsList").innerText = sequence.join(" - ");

  return sequence;
};



// the prime factors for this number are: [ 2, 3, 5, 7, 11, 13 ]
// console.log("Running prime factorization on 30030");
// console.log(getPrimeFactors(30030));
