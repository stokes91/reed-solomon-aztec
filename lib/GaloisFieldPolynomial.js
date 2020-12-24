/*
   Copyright 2020 Alexander Stokes

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

class GaloisFieldPolynomial {
  constructor() {}

  copy() {
    const that = new GaloisFieldPolynomial();
    that.field = this.field;
    that.coefficients = this.coefficients.slice(0);
    return that;
  }

  reduce() {
    let l = this.coefficients.length;
    if (l === 1) {
      return this;
    }

    while (this.coefficients.length > 1 && this.field.Zero(this.leadingCoefficient())) {
      this.coefficients.pop();
    }

    return this;
  }

  degree() {
    return this.coefficients.length - 1;
  }

  leadingCoefficient() {
    return this.coefficients[this.degree()];
  }

  constantCoefficient() {
    return this.coefficients[0];
  }

  zero() {
    return (this.degree() === 0 && this.constantCoefficient() === 0);
  }

  coefficientAt(i) {
    if (i > this.degree())
      return 0;

    return this.coefficients[i];
  }

  evaluateAt(a) {
    if (this.field.Zero(a)) {
      return this.constantCoefficient();
    }
    else if (this.field.One(a)) {
      let result = 0;
      for (let l = this.coefficients.length; l--;) {
        result = this.field.Add(result, this.coefficients[l]);
      }
      return result;
    }

    let result = this.leadingCoefficient();
    for (let l = this.degree(); l--;) {
      result = this.field.Add(this.field.Multiply(result, a), this.coefficients[l]);
    }

    return result;
  }

  add(that) {
    for (let l = Math.max(this.coefficients.length, that.coefficients.length), i = 0; l--; i++) {
      this.coefficients[i] = this.field.Add(this.coefficientAt(i), that.coefficientAt(i));
    }

    return this.reduce();
  }

  multiply(that) {
    const newSize = that.coefficients.length + this.coefficients.length + 1;
    const coefficients = new Array(newSize).fill(0);

    that.coefficients.map((that) => {
      return this.copy().multiplyByScalar(that);
    }).forEach((that, i) => {
      that.coefficients.forEach((that, j) => {
        coefficients[i + j] = this.field.Add(coefficients[i + j], that);
      });
    });

    this.coefficients = coefficients;
    return this.reduce();
  }

  multiplyByScalar(coefficient) {
    for (let l = this.coefficients.length; l--;) {
      this.coefficients[l] = this.field.Multiply(this.coefficients[l], coefficient);
    }

    return this;
  }

  findZeroes() {
    const errorCount = this.degree();

    if (errorCount === 1) {
      return [this.field.Invert(this.leadingCoefficient())];
    }

    const zeroes = [];
    for (let i = 1, l = this.field.Size; l--; i++) {
      if (!this.field.Zero(this.evaluateAt(i))) continue;
      zeroes.push(i);
      if (zeroes.length === errorCount) return zeroes;
    }

    return zeroes;
  }

  shift(degree) {
    for (let l = degree; l--;) {
      this.coefficients.unshift(0);
    }

    return this;
  }

  berlekampMassey(r, rLast) {
    while (r.degree() >= rLast.degree() && r.leadingCoefficient() !== 0) {
      const degreeDiff = r.degree() - rLast.degree();
      const scale = this.field.Divide(r.leadingCoefficient(), rLast.leadingCoefficient());

      this.add(GaloisFieldPolynomial.monomial(this.field, degreeDiff, scale));
      r.add(rLast.copy().multiplyByScalar(scale).shift(degreeDiff));
    }
    return this;
  }

  toLaTeX() {
    const cols = this.coefficients.map((coefficient, power) => {
      return { coefficient, power };
    }).filter((that) => {
      return !this.field.Zero(that.coefficient);
    }).reverse().map((that) => {
      const { coefficient, power } = that;
      const coefficientLaTeX = `\\text{${coefficient.toString(16).padStart(2, '0').toUpperCase()}}_{16}`;
      if (power === 0) {
        return `${coefficientLaTeX}`;
      }
      else if (power === 1) {
        return `${coefficientLaTeX}a`;
      }

      let powerString = power.toString();
      if (powerString.length > 1) powerString = '{' + powerString + '}';
      return `${coefficientLaTeX}a^${powerString}`;
    });

    if (!cols.length) {
      cols.push(this.constantCoefficient().toString());
    }

    return cols.join(' + ');
  }
}

GaloisFieldPolynomial.from = (field, array, BLOCKS_ECC) => {
  const poly = GaloisFieldPolynomial.fromArray(field, array);
  const that = new GaloisFieldPolynomial();
  that.field = field;
  that.coefficients = new Array(BLOCKS_ECC);

  for (let i = BLOCKS_ECC; i--;) {
    that.coefficients[i] = poly.evaluateAt(field.Exp(i + 1));
  }

  return that.reduce();
};

GaloisFieldPolynomial.monomial = (field, degree, scale) => {
  const that = new GaloisFieldPolynomial();
  that.field = field;
  that.coefficients = new Array(degree).fill(0);
  that.coefficients[degree] = scale;

  return that;
};

GaloisFieldPolynomial.zero = (field) => {
  const that = new GaloisFieldPolynomial();
  that.field = field;
  that.coefficients = [0];

  return that;
};

GaloisFieldPolynomial.one = (field) => {
  const that = new GaloisFieldPolynomial();
  that.field = field;
  that.coefficients = [1];

  return that;
};

GaloisFieldPolynomial.fromArray = (field, array) => {
  const that = new GaloisFieldPolynomial();
  that.field = field;
  that.coefficients = array.slice().reverse();
  that.reduce();

  return that;
};

module.exports = GaloisFieldPolynomial;
