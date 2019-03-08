const inputId = "theInput";
const outputId = "theOutput";
const errorId = "theError";

const enclosures = ["'", "`", `"`];

document.getElementById(inputId)
  .addEventListener('input', transformTextToTemplateLiteral);

function parseInput(inputStr) {
  
  const inputLength = inputStr.length;
  let stack = [];
  
  for(let i = 0; i < inputLength; i++) {
    let currentChar = inputStr[i];
    let lastCharInStack = stack[stack.length-1];
    
    // in not ", ', or `;
    if (!enclosures.includes(currentChar)) {
      continue;
    } 
    else if (currentChar === lastCharInStack) {
      stack.pop();
    }
    else {
      stack.push(currentChar);
    }
  }

  if (Boolean(stack.length)) {
    document.getElementById(errorId).innerHTML = `something's not closed correctly`;
  } else {
    document.getElementById(errorId).innerHTML = ``;
  }
  const parsed = inputStr;

  return parsed;
}

function toTemplateLiterals(parsed) {
  
  const tl = `\`${parsed}\``
  return tl;
}

function transformTextToTemplateLiteral(evt) {
  console.log(evt.target.value);
  const inputStr = evt.target.value;
  const parsed = parseInput(inputStr);
  const transformed = toTemplateLiterals(parsed);
  document.getElementById(outputId).innerHTML = transformed;
}

