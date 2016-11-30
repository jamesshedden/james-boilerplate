const allElements = document.querySelectorAll('*');

const DIRECTIONS = ['top', 'left', 'bottom', 'right'];
const INCREMENT = 3;

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDirections() {
  let directions = [];
  const clonedDirections = DIRECTIONS.slice();

  let firstRandomNumber = getRandomNumber(0, clonedDirections.length - 1);

  directions.push(clonedDirections[firstRandomNumber]);
  clonedDirections.splice(firstRandomNumber, 1);

  directions.push(clonedDirections[getRandomNumber(0, clonedDirections.length - 1)]);

  return directions;
}

function isPositiveNumber(number) {
  return Math.sign(number) === 1 ? true : false;
}

function getTransformValue(x, y) {
  return `translateX(${ x }px) translateY(${ y }px)`
}

function translateXY(element) {
  let values = element.style.transform.match(/[-0-9]+/g).map((value) => {
    return parseFloat(value);
  });

  let translated = [
    isPositiveNumber(values[0]) ? values[0] + INCREMENT : values[0] - INCREMENT,
    isPositiveNumber(values[1]) ? values[1] + INCREMENT : values[1] - INCREMENT
  ];

  return getTransformValue(translated[0], translated[1]);
}

function randomiseLayout() {
  [].forEach.call(allElements, function(element) {
    if (element.tagName === 'SPAN') {
      element.style.display = 'inline-block';
    }

    element.style.transition = 'transform 0.2s ease';

    if (!!element.style.transform) {
      element.style.transform = translateXY(element);
    } else {
      element.style.transform = getTransformValue(getRandomNumber(-INCREMENT, INCREMENT), getRandomNumber(-INCREMENT, INCREMENT));
    }
  });
}

window.addEventListener('scroll', randomiseLayout, { passive: true });
