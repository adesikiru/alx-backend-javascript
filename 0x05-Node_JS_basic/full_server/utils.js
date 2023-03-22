import fs from 'fs';

const readDatabase = (argPath) => new Promise((resolve, reject) => {
  if (!argPath) {
    reject(new Error('Cannot load the database'));
  }
  if (argPath) {
    fs.readFile(argPath, (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
      }
      if (data) {
        const files = data
          .toString('utf-8')
          .trim()
          .split('\n');
        const studGroup = {};
        const dbFieldNames = files[0].split(',');
        const studNames = dbFieldNames.slice(0, dbFieldNames.length - 1);

        for (const fil of files.slice(1)) {
          const studRecords = fil.split(',');
          const studValues = studRecords.slice(0, studRecords.length - 1);
          const field = studRecords[studRecords.length - 1];
          if (!Object.keys(studGroup).includes(field)) {
            studGroup[field] = [];
          }
          const entries = studNames
            .map((propName, idx) => [propName, studValues[idx]]);
          studGroup[field].push(Object.fromEntries(entries));
        }
        resolve(studGroup);
      }
    });
  }
});

export default readDatabase;
module.exports = readDatabase;
