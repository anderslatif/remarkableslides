
function fillWidthWithPattern(string) {
  const repeatCount = Math.ceil(process.stdout.columns / string.length);
  return string.repeat(repeatCount);
}

export function createSectionHeader(title) {
    const header = fillWidthWithPattern('=');
    return `\n${header}\n${title}\n${header}\n`;
}

export function createHorizontalRule() {
    return fillWidthWithPattern('=');
}
