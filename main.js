const PDFParser = require('pdf2json');
const textract = require('textract');
const glob = require('glob');
const {calcTotal} = require("./lib/time-content");
const chalk = require('chalk');
const fs = require('fs');

const resultMap = new Map();
let pdfs = [];
let docs = [];

function batchScore(pathname = 'doc') {
  if (!fs.existsSync(pathname)) {
    console.error(`${pathname} is not exist!`);
    return;
  }
  const isDir = fs.lstatSync(pathname).isDirectory();
  if (isDir) {
    pdfs = glob.sync(`${pathname}/*.pdf`, {});
    docs = glob.sync(`${pathname}/*.doc`, {}).filter(v => !v.includes('/~$'));
  } else {
    if (pathname.endsWith('pdf')) {
      pdfs = [pathname];
    } else {
      docs = [pathname];
    }
  }

  pdfs.sort().forEach((file) => {
    const pdfParser = new PDFParser(this, 1);
    pdfParser.loadPDF(file);
    pdfParser.on('pdfParser_dataError', errData => new Error(errData.parserError));
    pdfParser.on('pdfParser_dataReady', () => {
      checkDone(file, pdfParser.getRawTextContent());
    });
  });

  docs.sort().forEach((file) => {
    textract.fromFileWithPath(file, (err, data) => {
      checkDone(file, data);
    });
  });
}

function checkDone(file, content) {
  const result = calcTotal(content);
  resultMap.set(file, result);
  if (resultMap.size === docs.length + pdfs.length) {
    const tuple = Array.from(resultMap.entries()).sort((a, b) => b[1].levelValue - a[1].levelValue);
    const mapOk = new Map(tuple);
    let i = 0;
    mapOk.forEach((result, filePath) => {
      i += 1;
      const fileName = filePath.split('/').pop().split('.').shift();
      const level = result.level.padEnd(4, ' ');
      const score = result.score.toFixed(1).padStart(5, ' ');
      const workAge = (Math.round(result.workAge * 2) / 2).toFixed(1).padStart(5, ' ');
      const ii = mapOk.size > 1 ? i.toString().padStart(2, '0') : '';
      let ss = '';
      if (result.levelValue >= 8) {
        ss = `🐮`.repeat(3);
        console.log(chalk.red(`${ii} ${ss} ${level} ${score} ${workAge} ${fileName}`));
      } else if (result.levelValue >= 6) {
        ss = `🦞`.repeat(3);
        console.log(chalk.yellow(`${ii} ${ss} ${level} ${score} ${workAge} ${fileName}`));
      } else if (result.levelValue >= 4) {
        ss = `🦧`.repeat(3);
        console.log(chalk.blue(`${ii} ${ss} ${level} ${score} ${workAge} ${fileName}`));
      } else if (result.levelValue >= 2) {
        ss = `🥦`.repeat(3);
        console.log(chalk.green(`${ii} ${ss} ${level} ${score} ${workAge} ${fileName}`));
      } else {
        ss = `🥬`.repeat(3);
        console.log(chalk.gray(`${ii} ${ss} ${level} ${score} ${workAge} ${fileName}`));
      }
    });
  }
}

const folder = process.argv.slice().pop();
batchScore(folder);
