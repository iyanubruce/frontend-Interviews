# Sleep

**Difficulty:** Easy

## Description

In JavaScript, the `setTimeout` function can be used to execute callbacks after a delay. However, it introduces a layer of nesting in the code, which may not be desired. It would be nice to use `setTimeout` in this fashion:

```js
// Note: the following code contains invalid syntax and does not work.
console.log('Hello!');
setTimeout(1000);
console.log('Bye.');
```

In languages like Java and Python, a `sleep` function is available to suspend execution of the calling thread. However, unlike those languages, JavaScript is single-threaded, and blocking the main thread is not a good idea. Therefore, let's implement an **asynchronous** version of the `sleep` function that works similarly but does not block the main thread.

## Examples

```js
async function greeting() {
  console.log('Hello!');
  await sleep(2000);
  console.log('Bye.'); // Only logs after 2000 milliseconds (2 seconds)
}

greeting();
// t = 0: Hello!
// t = 2000: Bye.
```

The `sleep` function should also work without `await`:

```js
console.log('Hello!');
sleep(2000).then(() => {
  console.log('Bye.'); // Only logs after 2000 milliseconds (2 seconds)
});
```

## Files

| File | Contents |
| --- | --- |
| `sleep.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
