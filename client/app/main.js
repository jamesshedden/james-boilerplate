
// JavaScripts here!
//
// fetch('https://gocardless.com', { mode: 'no-cors' })
//   .then((response) => {
//     console.log('response', response);
//   });

let xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", 'https://gocardless.com', true);
xmlHttp.send(null);
console.log('xmlHttp.responseText', xmlHttp.responseText)



const DIRECTIONS = ['top', 'left', 'bottom', 'right'];

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

function getFloatFromPx(value) {
  return parseFloat(value.replace('px', ''));
}

function changePositionValue(direction) {
  if (isPositiveNumber(getFloatFromPx(direction))) {
    return getFloatFromPx(direction) + 3 + 'px';
  } else {
    return getFloatFromPx(direction) - 3 + 'px';
  }
}

function randomiseLayout() {
  [].forEach.call(document.querySelectorAll('*'), function(b) {
    b.style.position = 'relative';
    b.style.transition = 'all 0.2s ease';

    if (b.style.top !== '' && b.style.left !== '') {
      b.style.top = changePositionValue(b.style.top);
      b.style.left = changePositionValue(b.style.left);
    } else if (b.style.top !== '' && b.style.bottom !== '') {
      b.style.top = changePositionValue(b.style.top);
      b.style.bottom = changePositionValue(b.style.bottom);
    } else if (b.style.top !== '' && b.style.right !== '') {
      b.style.top = changePositionValue(b.style.top);
      b.style.right = changePositionValue(b.style.right);
    } else if (b.style.bottom !== '' && b.style.left !== '') {
      b.style.bottom = changePositionValue(b.style.bottom);
      b.style.left = changePositionValue(b.style.left);
    } else if (b.style.bottom !== '' && b.style.right !== '') {
      b.style.bottom = changePositionValue(b.style.bottom);
      b.style.right = changePositionValue(b.style.right);
    } else if (b.style.left !== '' && b.style.right !== '') {
      b.style.left = changePositionValue(b.style.left);
      b.style.right = changePositionValue(b.style.right);
    } else {
      getRandomDirections().map((direction) => {
        b.style[direction] = getRandomNumber(-1, 1) + 'px';
      });
    }
  });
}

window.addEventListener('scroll', randomiseLayout, { passive: true });
