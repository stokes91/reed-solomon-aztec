# reed-solomon-aztec

Aztec Codes include some number of error correction codes amended to the data within the encoding region.

If you're looking to generate or read these blocks of data, this code will save you the trouble of porting some of the more tedious code of the Aztec spec from another library.

## Modestly fast

Try out examples/test to see how fast it is on your machine. A fairly small cloud instance can achieve approximately 19K repairs per second of RS(15, 10) (with 2 randomly placed errors).

## Succinct and math focused

The code is written in a way that minimizes the use of tiny performance boosts in favor of clarity. It is designed to accept garbage data and not throw errors, but rather return a true on failure, fals-y if the buffer was repaired, or false if already pristine before decode.

## Zero dependencies

It's just half a thousand lines of clear, readable, code.

## Also Free

Licensed under Apache 2.0

