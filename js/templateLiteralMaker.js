const inputId = "theInput";
const outputId = "theOutput";
const errorId = "theError";
const copyButton = "copyButton";

const enclosures = ["'", "`", `"`];

document
  .getElementById(inputId)
  .addEventListener("input", transformTextToTemplateLiteral);

document.getElementById(inputId)
  .value = `"youve got " + 1 + ' example right ' + \`in this section\``;

function transformTextToTemplateLiteral(evt) {
  console.log(evt.target.value);
  const inputStr = sanitize(evt.target.value);
  const plusIndexes = parseInput(inputStr);
  const transformed = toTemplateLiterals(inputStr, plusIndexes);
  document.getElementById(outputId).value = transformed;
}

function parseInput(inputStr) {
  let plusIndexes = [];
  const inputLength = inputStr.length;
  let stack = [];

  for (let i = 0; i < inputLength; i++) {
    let currentChar = inputStr[i];
    let lastCharInStack = stack[stack.length - 1];

    if (currentChar === "+" && stack.length === 0) {
      plusIndexes.push(i);
    } else if (!enclosures.includes(currentChar)) {
      // in not ", ', or `;
      continue;
    } else if (currentChar === lastCharInStack) {
      stack.pop();
    } else {
      stack.push(currentChar);
    }
  }

  if (Boolean(stack.length)) {
    document.getElementById(
      errorId
    ).innerHTML = `something's not closed correctly`;
  } else {
    document.getElementById(errorId).innerHTML = ``;
  }
  return plusIndexes;
}

function toTemplateLiterals(inputStr, plusIndexes) {
  let parts = [];
  let currentStr = inputStr;
  while (plusIndexes.length) {
    let idx = plusIndexes.pop();
    parts.unshift(currentStr.substring(idx + 1).trim());
    currentStr = currentStr.substring(0, idx);
  }
  parts.unshift(currentStr.trim());

  const processedParts = parts.map(processPart);

  const templateLiteral = `\`${processedParts.join("")}\``;
  return templateLiteral;
}

function sanitize(str) {
  const origLength = str.length;
  let sanitized = str.trim();
  if (sanitized.charAt(0) === "+") {
    sanitized = sanitized.slice(1);
  }
  if (sanitized.charAt(sanitized.length - 1) === "+") {
    sanitized = sanitized.slice(0, sanitized.length - 1);
  }

  if (sanitized.length === origLength) {
    return sanitized;
  } else {
    return sanitize(sanitized);
  }
}

function processPart(str) {
  if (str.length === 0) {
    return "";
  } else if (enclosures.includes(str.charAt(0))) {
    // remove encapsulating characters
    return str.substring(1, str.length - 1);
  } else if (typeof Number(str) === "number" && !isNaN(Number(str))) {
    // if it's a number
    return str;
  } else if (["undefined", "null", "NaN"].includes(str)) {
    return str;
  } else {
    return `\${${str}}`;
  }
}

function copyToClipboard() {
  const templateLiteral = document.getElementById(outputId);
  const str = templateLiteral.value;
  const tempEl = document.createElement("textarea");
  tempEl.value = str;
  tempEl.setAttribute("readonly", "");
  tempEl.style.position = "absolute";
  tempEl.style.left = "-9999px";
  document.body.appendChild(tempEl);
  tempEl.select();
  document.execCommand("copy");
  document.body.removeChild(tempEl);
}
