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

function GaloisField(size, generator) {
  const ExpTable = [];
  const LogTable = [0];

  let j = 1;
  for (let i = 0; i < size; i++) {
    ExpTable[i] = j;
    j = j << 1;
    if (j >= size) j ^= generator;
  }
  for (let i = 0; i < size - 1; i++) {
    LogTable[ExpTable[i]] = i;
  }

  const Size = size - 1;

  function Zero(x) {
    return x === 0;
  }

  function One(x) {
    return x === 1;
  }

  function Multiply(x, y) {
    if (x === 0 || y === 0) return 0;
    return ExpTable[(LogTable[x] + LogTable[y]) % Size];
  }

  function Invert(x) {
    return ExpTable[Size - LogTable[x]];
  }

  function Divide(x, y) {
    return Multiply(x, Invert(y));
  }

  function Log(x) {
    return LogTable[x];
  }

  function Exp(x) {
    return ExpTable[x];
  }

  function Add(x, y) {
    return x ^ y;
  }

  return { Zero, One, Multiply, Invert, Log, Exp, Add, Size, Divide };
}

module.exports = {
  GF16: GaloisField(0x10, 0x13),
  GF64: GaloisField(0x40, 0x43),
  GF256: GaloisField(0x100, 0x12D),
  GF1024: GaloisField(0x400, 0x409),
  GF4096: GaloisField(0x1000, 0x1069)
};
