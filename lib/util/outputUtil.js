export function removeIgnoredSections(inputString, className) {
    const regex = new RegExp(`<div class=["']${className}["']>[\\s\\S]*?<\\/div>`, 'g');
    return inputString.replaceAll(regex, '');
}
