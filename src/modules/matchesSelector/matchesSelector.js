/**
 * matchesSelector
 * @param element
 * @param selector
 * 如果元素被指定的选择器字符串选择，Element.matches() ? true : false
 * 针对不同浏览器的解决方案
 * chrome: webkitMatchesSelector
 * firefox: mozMatchesSelector
 * opera: oMatchesSelector
 * IE :  msMatchesSelector
 */
const matchesSelector = (element, selector) => {
  if (element.matches) {
    return element.matches(selector);
  } else if (element.matchesSelector) {
    return element.matchesSelector(selector);
  } else if (element.webkitMatchesSelector) {
    return element.webkitMatchesSelector(selector);
  } else if (element.msMatchesSelector) {
    return element.msMatchesSelector(selector);
  } else if (element.mozMatchesSelector) {
    return element.mozMatchesSelector(selector);
  } else if (element.oMatchesSelector) {
    return element.oMatchesSelector(selector);
  }
};


export default matchesSelector;
