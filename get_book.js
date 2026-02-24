const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://sorenblank.com/snippets/3d-book', { waitUntil: 'networkidle2' });
  
  // Try to find the code block
  const code = await page.evaluate(() => {
    const codeBlk = document.querySelector('code');
    return codeBlk ? codeBlk.innerText : document.body.innerText;
  });
  
  console.log("CODE_START");
  console.log(code);
  console.log("CODE_END");
  
  await browser.close();
})();
