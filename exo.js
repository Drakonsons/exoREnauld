function categorize(values) {
  return values.reduce((result, value) => {
    const type = typeof value;

    const typeString =
      type === "object" && value !== null
        ? Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
        : type;
    result[typeString] = result[typeString] || [];

    result[typeString].push(value);

    return result;
  }, {});
}

const inputArray = [
  1,
  "hello",
  function sayHi() {
    console.log("hi");
  },
  "world",
  true,
  0n,
  1000,
];
const result = categorize(inputArray);
console.log(result);

if (!Array.prototype.dedup) {
  Array.prototype.dedup = function () {
    const deduplicatedArray = [];

    for (const value of this) {
      if (!deduplicatedArray.includes(value)) {
        deduplicatedArray.push(value);
      }
    }

    return deduplicatedArray;
  };
}

const deduplicatedArray = inputArray.dedup();
console.log(deduplicatedArray);

function filterByObject(obj, predicate) {
  return Object.entries(obj)
    .filter(([key, value]) => predicate(key, value))
    .reduce((result, [key, value]) => {
      result[key] = value;
      return result;
    }, {});
}

const obj = {
  foo: 1,
  bar: "hello",
  baz: true,
};

const filtered = filterByObject(
  obj,
  (key, value) => key === "foo" || value === "hello"
);
console.log(filtered);

const asyncJob = (n) =>
  Math.random() > 0.5 ? Promise.resolve(n + 1) : Promise.reject(Error("boom"));

async function executeAsyncJob() {
  try {
    const i = await asyncJob(0);
    const j = await asyncJob(i);
    const [x, y, z] = await Promise.all([
      asyncJob(j),
      asyncJob(j),
      asyncJob(j),
    ]);

    const result = await asyncJob(x + y + z);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

executeAsyncJob();

function race(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      Promise.resolve(promise).then(
        (value) => {
          resolve(value);
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
}

const promise1 = new Promise((resolve) =>
  setTimeout(() => resolve("Promise 1 resolved"), 1000)
);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve("Promise 2 resolved"), 500)
);
const promise3 = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Promise 3 rejected")), 200)
);

race([promise1, promise2, promise3])
  .then((value) => console.log("Resolved:", value))
  .catch((reason) => console.log("Rejected:", reason));

function all(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let resolvedCount = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(
        (value) => {
          results[index] = value;
          resolvedCount++;

          if (resolvedCount === promises.length) {
            resolve(results);
          }
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
}

const promise10 = Promise.resolve("Promise 10 resolved");
const promise20 = Promise.resolve("Promise 20 resolved");
const promise30 = Promise.reject(new Error("Promise 30 rejected"));

all([promise10, promise20, promise30])
  .then((values) => console.log("Resolved:", values))
  .catch((reason) => console.log("Rejected:", reason.message));
