const fs = require("fs").promises;
const path = require("path");
const git = require("simple-git/promise");
const fse = require("fs-extra");
const google = {
  dir: "google-10000-english",
  url: "https://github.com/first20hours/google-10000-english.git"
};

const fetchRepo = async (url, dir) => {
  await fse.remove(dir);
  await git().clone(url, dir);
};

const createSwiftArrayFile = async dir => {
  const files = await fs.readdir(dir);
  const textFiles = files.filter(file => {
    return path.extname(file) === ".txt";
  });
  const outputDir = `./dist/${dir}/swift/`;
  await fse.mkdirp(outputDir);

  await Promise.all(
    textFiles.map(async file => {
      const readFile = `./${dir}/${file}`;
      const fileContent = await fs.readFile(readFile, "utf8");

      const header = "let english_array = [\n";
      const words = fileContent
        .split("\n")
        .filter(x => x !== "")
        .reduce((prev, cur) => {
          return `${prev}  "${cur}",\n`;
        }, "");
      const footer = "\n]";
      const str = header + words.substring(0, words.length - 2) + footer;

      const writeFilename = `array-${path.basename(file, ".txt")}.swift`;
      const writeFile = `./dist/${dir}/swift/${writeFilename}`;
      await fs.writeFile(writeFile, str, "utf8");
      return str;
    })
  );
};

const createSwiftDictFile = async dir => {
  const files = await fs.readdir(dir);
  const textFiles = files.filter(file => {
    return path.extname(file) === ".txt";
  });
  const outputDir = `./dist/${dir}/swift/`;
  await fse.mkdirp(outputDir);

  await Promise.all(
    textFiles.map(async file => {
      const readFile = `./${dir}/${file}`;
      const fileContent = await fs.readFile(readFile, "utf8");

      const header = "let english_dict = [\n";
      const words = fileContent
        .split("\n")
        .filter(x => x !== "")
        .reduce((prev, cur) => {
          return `${prev}  "${cur}": 1,\n`;
        }, "");
      const footer = "\n]";
      const str = header + words.substring(0, words.length - 2) + footer;

      const outputDir = `./dist/${dir}/swift/`;
      await fse.mkdirp(outputDir);
      const writeFilename = `dict-${path.basename(file, ".txt")}.swift`;
      const writeFile = `./dist/${dir}/swift/${writeFilename}`;
      await fs.writeFile(writeFile, str, "utf8");
      return str;
    })
  );
};

fetchRepo(google.url, google.dir);
createSwiftArrayFile(google.dir);
createSwiftDictFile(google.dir);
