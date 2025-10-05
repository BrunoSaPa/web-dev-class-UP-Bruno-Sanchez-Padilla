/*
    Sieve of Eratosthenes - The sieve of Eratosthenes is one of the most efficient ways
    to find all of the smaller primes (below 10 million or so).
*/

// TODO: Adjust this script so it can work with the sieve.html file.

var sieve = function (n) {
  "use strict";

  var array = [],
    primes = [],
    i,
    j;

  // TODO: Implement the sieve of eratosthenes algorithm to find all the prime numbers under the given number.
  for (i = 2; i <= n; i++) {
    array[i] = true;
  }

  for (i = 2; i <= Math.sqrt(n); i++) {
    if (array[i] === true) {
      for (j = i * i; j <= n; j += i) {
        array[j] = false;
      }
    }
  }

  //get primes from the array
  for (i = 2; i <= n; i++) {
    if (array[i] === true) {
      primes.push(i);
    }
  }

  return primes;
};

function showPrimes() {
  "use strict";
  var num = document.getElementById("num").value;
  var primes = sieve(num);
  document.getElementById("primes").innerText = primes.join(" - ");
}

console.log(sieve(1000000));
