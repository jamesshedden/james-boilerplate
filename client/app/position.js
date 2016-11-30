const allElements = document.querySelectorAll('*');

const DIRECTIONS = ['top', 'left', 'bottom', 'right'];
const INCREMENT = 1;

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isPositiveNumber(number) {
  return Math.sign(number) === 1 ? true : false;
}

function getTransformValue(x, y, isPercent) {
  let unit = isPercent ? '%' : 'px';
  return `translateX(${ x }${ unit }) translateY(${ y }${ unit })`
}

function translateXY(element) {
  let values = element.style.transform.match(/[-0-9]+/g).map((value) => {
    return parseFloat(value);
  });

  let translated = [
    isPositiveNumber(values[0]) ? values[0] + INCREMENT*2000 : values[0] - INCREMENT*2000,
    isPositiveNumber(values[1]) ? values[1] + INCREMENT*2000 : values[1] - INCREMENT*2000
  ];

  return getTransformValue(translated[0], translated[1]);
}

function randomiseLayout() {
  [].forEach.call(allElements, function(element) {
    element.style.transition = 'transform 200s ease';
    element.style.transform = getTransformValue(0, 0);
    element.style.transform = getTransformValue(getRandomNumber(-INCREMENT, INCREMENT), getRandomNumber(-INCREMENT, INCREMENT));

    element.style.transform = translateXY(element);
  });
}

randomiseLayout();
