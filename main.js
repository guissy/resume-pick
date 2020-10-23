const PDFParser = require('pdf2json');
const textract = require('textract');
const glob = require('glob');
const {calcTotal} = require("./lib/time-content");
const chalk = require('chalk');

const map = new Map();
const pdfs = glob.sync(`doc/*.pdf`, {});
pdfs.sort().forEach((pdf) => {
  const pdfParser = new PDFParser(this, 1);
  pdfParser.loadPDF(pdf);
  pdfParser.on('pdfParser_dataError', errData => new Error(errData.parserError));
  pdfParser.on('pdfParser_dataReady', () => {
    let data = pdfParser.getRawTextContent();
    const score = calcTotal(data);
    checkDone(pdf, score);
  });
});

const docs = glob.sync(`doc/*.doc`, {}).filter(v => !v.includes('/~$'));
docs.sort().forEach((pdf) => {
  textract.fromFileWithPath(pdf, (err, data) => {
    const score = calcTotal(data);
    checkDone(pdf, score);
  });
});

function checkDone(pdf, score) {
  map.set(pdf, score);
  if (map.size === docs.length + pdfs.length) {
    const tuple = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    const mapOk = new Map(tuple);
    let i = 0;
    mapOk.forEach((v, k) => {
      i += 1;
      const fileName = k.split('/').pop().split('.').shift();
      const score = v.toFixed(1).padStart(5, ' ');
      const ii = i.toString().padStart(2, '0');
      if (v >= 20) {
        console.log(chalk.red(`${ii} ${score} ${fileName}`));
      } else if (v < 20 && v > 10) {
        console.log(chalk.blue(`${ii} ${score} ${fileName}`));
      } else {
        console.log(chalk.green(`${ii} ${score} ${fileName}`));
      }
    });
  }
}
