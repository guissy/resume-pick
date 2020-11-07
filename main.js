const PDFParser = require('pdf2json');
const textract = require('textract');
const glob = require('glob');
const {calcTotal} = require("./lib/time-content");
const chalk = require('chalk');

const map = new Map();
const pdfs = glob.sync(`doc/*.pdf`, {});
pdfs.sort().forEach((file) => {
  const pdfParser = new PDFParser(this, 1);
  pdfParser.loadPDF(file);
  pdfParser.on('pdfParser_dataError', errData => new Error(errData.parserError));
  pdfParser.on('pdfParser_dataReady', () => {
    checkDone(file, pdfParser.getRawTextContent());
  });
});

const docs = glob.sync(`doc/*.doc`, {}).filter(v => !v.includes('/~$'));
docs.sort().forEach((file) => {
  textract.fromFileWithPath(file, (err, data) => {
    checkDone(file, data);
  });
});

function checkDone(file, content) {
  const {score} = calcTotal(content);
  map.set(file, score);
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
