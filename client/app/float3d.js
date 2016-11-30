const allElements = document.body.querySelectorAll('*');
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

function translateXYZ(element) {
  let values = element.style.transform.match(/[-0-9]+/g).map((value) => {
    return parseFloat(value);
  });

  let translated = [
    isPositiveNumber(values[0]) ? values[0] + INCREMENT*2000 : values[0] - INCREMENT*2000,
    isPositiveNumber(values[1]) ? values[1] + INCREMENT*2000 : values[1] - INCREMENT*2000,
    isPositiveNumber(values[2]) ? values[2] + INCREMENT*2000 : values[2] - INCREMENT*2000
  ];

  return getTransformValue(translated[0], translated[1], translated[2]);
}

function randomiseLayout() {
  [].forEach.call(allElements, function(element) {
    if (element.tagName === 'SPAN') {
      element.style.display = 'inline-block';
    }

    element.style.transition = 'transform 200s ease';
    element.style.transform = getTransformValue(0, 0);
    element.style.transform = getTransformValue(getRandomNumber(-INCREMENT, INCREMENT), getRandomNumber(-INCREMENT, INCREMENT), getRandomNumber(-INCREMENT, INCREMENT));

    element.style.transform = translateXYZ(element);
  });
}

randomiseLayout();
