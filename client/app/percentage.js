import _ from 'lodash';

const allElements = document.querySelectorAll('*');
const INCREMENT = 1;

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

function getTransformValue(x, y, isPercent) {
  let unit = isPercent ? '%' : 'px';
  return `translateX(${ x }${ unit }) translateY(${ y }${ unit })`
}

function translateXY(element) {
  let values = element.style.transform.match(/[-0-9]+/g).map((value) => value);
  let translated = [
    isPositiveNumber(values[0]) ? `${getScrollPercentage()}` : `-${getScrollPercentage()}`,
    isPositiveNumber(values[1]) ? `${getScrollPercentage()}` : `-${getScrollPercentage()}`
  ];

  return getTransformValue(translated[0], translated[1]);
}

function getScrollPercentage() {
  let bodyHeight = parseFloat(getComputedStyle(document.body).height.replace('px',''));
  return Math.round((window.scrollY / bodyHeight) * 100);
}

function changePositionValue(direction) {
  if (isPositiveNumber(getFloatFromPx(direction))) {
    return `${getScrollPercentage()}%`
  } else {
    return `-${getScrollPercentage()}%`
  }
}

function randomiseLayout() {
  if (!scrolled) {
    [].forEach.call(allElements, function(element) {
        element.style.transition = 'transform 200ms ease';
        element.style.transform = getTransformValue(0, 0);
        element.style.transform = getTransformValue(getRandomNumber(-INCREMENT, INCREMENT), getRandomNumber(-INCREMENT, INCREMENT));
    });

    scrolled = true;
  } else {
    [].forEach.call(allElements, function(element) {
      element.style.transform = translateXY(element);
    });
  }
}

let scrolled = false;
window.addEventListener('scroll', _.throttle(
  randomiseLayout, 50
), { passive: true });
