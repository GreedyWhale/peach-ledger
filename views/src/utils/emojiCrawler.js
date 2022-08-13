// eslint-disable-next-line no-unused-vars
function emojiCrawler() {
  const trList = Array.from(document.querySelector('table').querySelectorAll('tr'));
  const result = {};
  let key = '';
  trList.forEach(value => {
    key = value.querySelector('.bighead')?.textContent || key;
    let emoji = value.querySelector('.code')?.textContent;
    result[key] = result[key] || [];
    if (emoji) {
      // 浏览器不能显示U+开头的unicode
      // 要么转换成'\u{1F64D}'这种形式
      // 要么使用 String.fromCodePoint(parseInt('1F64D', 16))
      emoji = emoji.replace(/^U\+/gi, '').split(' ');
      result[key].push(emoji);
    }
  });

  return JSON.stringify(result);
}
