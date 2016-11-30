const allElements = [].slice.call(document.body.querySelectorAll('*'));
const INCREMENT = 1;

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isPositiveNumber(number) {
  return Math.sign(number) === 1 ? true : false;
}

function getTransformValue(x, y, z) {
  return `translateX(${ x }px) translateY(${ y }px) rotate(${ z/1000 }deg)`
}

function transformElement(element) {
  element.style.transform = getTransformValue(getRandomNumber(-2000, 2000), getRandomNumber(-2000, 2000), getRandomNumber(-2, 2));
}

allElements.map((element) => {
  if (element.tagName === 'SPAN') {
    element.style.display = 'inline-block';
  }

  element.style.transition = `transform ${getRandomNumber(30, 60)}s ease`;
  element.style.transform = getTransformValue(0, 0);
});

allElements.reduce((fold, element) => {
  return fold.then(() => {
    transformElement(element);
  }).then(() => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, getRandomNumber(50, 150));
    });
  });
}, Promise.resolve());
