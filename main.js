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

const FiniteField = require('rs-finite-field');

module.exports = {
  GF16: FiniteField(0x10, 0x13, 2),
  GF64: FiniteField(0x40, 0x43, 2),
  GF256: FiniteField(0x100, 0x12D, 2),
  GF1024: FiniteField(0x400, 0x409, 2),
  GF4096: FiniteField(0x1000, 0x1069, 2)
};
