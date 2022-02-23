const fs = require("fs");
const path = require("path");
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(v) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  subtract(v) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  scale(value) {
    return new Vector3(this.x * value, this.y * value, this.z * value);
  }

  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  sum() {
    return this.x + this.y + this.z;
  }
}
//  begin raw functions for testing normal object (non-class) time
function add(a, v) {
  return { x: a.x + v.x, y: a.y + v.y, z: a.z + v.z };
}

function subtract(a, v) {
  return { x: a.x - v.x, y: a.y - v.y, z: a.z - v.z };
}

function scale(a, value) {
  return { x: a.x * value, y: a.y * value, z: a.z * value };
}

function dot(a, v) {
  return a.x * v.x + a.y * v.y + a.z * v.z;
}

function sum(a) {
  return a.x + a.y + a.z;
}
//  end raw functions for testing normal object (non-class) time

let count = 5;
let size = 2000000;
let testCounts = 10;

let addMe = new Vector3(1, 0.5, 2);
let dotMe = new Vector3(2, 0.5, 1);
function testObjects() {
  let items = new Array(size);
  for (let k = 0; k < size; k++) {
    items[k] = new Vector3(k / 2, k / 2, -k / 8);
  }
  for (let i = 0; i < count; i++) {
    for (let k = 0; k < size; k++) {
      let item = items[k];
      items[k] = item.scale(item.add(addMe).dot(dotMe));
    }
  }
  let total = 0;
  for (let k = 0; k < size; k++) {
    total += items[k].sum();
  }
  return total;
}

function testNormalArrayHybrid() {
  let items = [];
  for (let k = 0; k < size; k++) {
    let index = k * 3;
    items[index] = k / 2;
    items[index + 1] = k / 2;
    items[index + 2] = -k / 8;
  }
  for (let i = 0; i < count; i++) {
    for (let k = 0; k < items.length; k += 3) {
      let x = items[k + 0];
      let y = items[k + 1];
      let z = items[k + 2];
      let item = new Vector3(x, y, z);
      item = item.scale(item.add(addMe).dot(dotMe));
      items[k + 0] = item.x;
      items[k + 1] = item.y;
      items[k + 2] = item.z;
    }
  }
  let total = 0;
  for (let k = 0; k < items.length; k++) {
    total += items[k];
  }
  return total;
}

function testTypedArrayHybrid64NoVectorClass() {
  let items = new Float64Array(size * 3);
  for (let k = 0; k < size; k++) {
    let index = k * 3;
    items[index] = k / 2;
    items[index + 1] = k / 2;
    items[index + 2] = -k / 8;
  }
  for (let i = 0; i < count; i++) {
    for (let k = 0; k < items.length; k += 3) {
      let x = items[k + 0];
      let y = items[k + 1];
      let z = items[k + 2];
      let item = { x, y, z };
      item = scale(item, dot(add(item, addMe), dotMe));
      items[k + 0] = item.x;
      items[k + 1] = item.y;
      items[k + 2] = item.z;
    }
  }
  let total = 0;
  for (let k = 0; k < items.length; k++) {
    total += items[k];
  }
  return total;
}

function testTypedArrayHybrid64() {
  let items = new Float64Array(size * 3);
  for (let k = 0; k < size; k++) {
    let index = k * 3;
    items[index] = k / 2;
    items[index + 1] = k / 2;
    items[index + 2] = -k / 8;
  }
  for (let i = 0; i < count; i++) {
    for (let k = 0; k < items.length; k += 3) {
      let x = items[k + 0];
      let y = items[k + 1];
      let z = items[k + 2];
      let item = new Vector3(x, y, z);
      item = item.scale(item.add(addMe).dot(dotMe));
      items[k + 0] = item.x;
      items[k + 1] = item.y;
      items[k + 2] = item.z;
    }
  }
  let total = 0;
  for (let k = 0; k < items.length; k++) {
    total += items[k];
  }
  return total;
}

function testTypedArrayHybrid32() {
  let items = new Float32Array(size * 3);
  for (let k = 0; k < size; k++) {
    let index = k * 3;
    items[index] = k / 2;
    items[index + 1] = k / 2;
    items[index + 2] = -k / 8;
  }
  for (let i = 0; i < count; i++) {
    for (let k = 0; k < items.length; k += 3) {
      let x = items[k + 0];
      let y = items[k + 1];
      let z = items[k + 2];
      let item = new Vector3(x, y, z);
      item = item.scale(item.add(addMe).dot(dotMe));
      items[k + 0] = item.x;
      items[k + 1] = item.y;
      items[k + 2] = item.z;
    }
  }
  let total = 0;
  for (let k = 0; k < items.length; k++) {
    total += items[k];
  }
  return total;
}

function testTypedArrayOptimized() {
  let items = new Float64Array(size * 3);
  for (let k = 0; k < size; k++) {
    let index = k * 3;
    items[index] = k / 2;
    items[index + 1] = k / 2;
    items[index + 2] = -k / 8;
  }
  for (let i = 0; i < count; i++) {
    for (let k = 0; k < items.length; k += 3) {
      let x = items[k + 0];
      let y = items[k + 1];
      let z = items[k + 2];
      let dot =
        (x + addMe.x) * dotMe.x +
        (y + addMe.y) * dotMe.y +
        (z + addMe.z) * dotMe.z;
      items[k + 0] = x * dot;
      items[k + 1] = y * dot;
      items[k + 2] = z * dot;
    }
  }
  let total = 0;
  for (let k = 0; k < items.length; k++) {
    total += items[k];
  }
  return total;
}

function ____testDataViewOptimized() {
    let length = size * 3
    let items = new DataView(new ArrayBuffer(length * 8))
    for (let k = 0; k < size; k++) {
        let index = k * 3 << 3
        items.setFloat64(index, k / 2, true)
        items.setFloat64(index+8, k / 2, true)
        items.setFloat64(index+16, - k / 8, true)
    }
    for (let i = 0; i < count; i++) {
        for (let k = 0; k < length; k += 3) {
            let index = k << 3
            let x = items.getFloat64(index, true)
            let y = items.getFloat64(index+8, true)
            let z = items.getFloat64(index+16, true)
            let dot = (x + addMe.x) * dotMe.x + (y + addMe.y) * dotMe.y + (z + addMe.z) * dotMe.z
            items.setFloat64(index, x * dot, true)
            items.setFloat64(index+8, y * dot, true)
            items.setFloat64(index+16, z * dot, true)
        }
    }
    let total = 0
    for (let k = 0; k < length; k++) {
        total += items.getFloat64(k << 3, true)
    }
    return total
}

function testTypedArrayProxy() {
  let items = new Proxy(new Float64Array(size * 3), {
    get(target, prop, receiver) {
      if (prop === "length") {
        return target.length;
      }
      return new Vector3(
        target[prop * 3],
        target[prop * 3 + 1],
        target[prop * 3 + 2]
      );
    },
    set(target, prop, value) {
      target[prop * 3] = value.x;
      target[prop * 3 + 1] = value.y;
      target[prop * 3 + 2] = value.z;
    },
  });
  for (let k = 0; k < size; k++) {
    items[k] = new Vector3(k / 2, k / 2, -k / 8);
  }
  for (let i = 0; i < count; i++) {
    for (let k = 0; k < size; k++) {
      let item = items[k];
      items[k] = item.scale(item.add(addMe).dot(dotMe));
    }
  }
  let total = 0;
  for (let k = 0; k < size; k++) {
    total += items[k].sum();
  }
  return total;
}

// wasm test
function runTest(fn) {
  let start = Date.now();
  let result = fn();
  let stop = Date.now();
  let time = stop - start;
  console.log(`${result} ${fn.name} ${time}ms`);
  return time;
}

(async function () {
  const memory = new WebAssembly.Memory({ initial: 800, maximum: 800 });
  const imports = {
    js: {
      memory,
      trace(a, b) {
        console.log(a, b);
      },
    },
  };
  const wasm = fs.readFileSync(path.join(__dirname, "./typedarray.wasm"));
  let { module: wasmModule, instance: wasmInstance } =
    await WebAssembly.instantiate(wasm, imports);
  function wasmTest() {
    let items = new Float64Array(memory.buffer); // create the typed array using the web assembly memory
    for (let k = 0; k < size; k++) {
      let index = k * 3;
      items[index] = k / 2;
      items[index + 1] = k / 2;
      items[index + 2] = -k / 8;
    }
    for (let i = 0; i < count; i++) {
      let result = wasmInstance.exports.addDotArray(
        size,
        addMe.x,
        addMe.y,
        addMe.z,
        dotMe.x,
        dotMe.y,
        dotMe.z
      );
      // console.log(result)
    }
    let total = 0;
    for (let k = 0; k < items.length; k++) {
      total += items[k];
    }
    return total;
  }
  function run(...tests) {
    for (let test of tests) {
      let times = [];
      for (let i = 0; i < testCounts; i++) {
        times.push(runTest(test));
      }
      let lastSamplesToAverage = 3;
      let time =
        times.slice(-lastSamplesToAverage).reduce((a, b) => a + b) /
        lastSamplesToAverage;
      console.log(test.name + ": " + Math.round(time) + " ms");
    }
  }
  run(
    wasmTest,
    testNormalArrayHybrid,
    testTypedArrayHybrid64NoVectorClass,
    testTypedArrayHybrid64,
    // testTypedArrayHybrid32,
    testTypedArrayOptimized
    // testTypedArrayProxy, // => Extremely slow, about 5 times slower than plain objects.
    // testObjects
  );
})();
