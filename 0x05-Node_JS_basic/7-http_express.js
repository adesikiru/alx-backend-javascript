const fs = require('fs');
const express = require('express');

const app = express();

const PORT = 1245;
const DB_FILE = process.argv.length > 2 ? process.argv[2] : '';

const countStudents = (argPath) => new Promise((resolve, reject) => {
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
        const preports = [];

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

        const totalStudents = Object
          .values(studGroup)
          .reduce((pre, cur) => (pre || []).length + cur.length);
        preports.push(`Number of students: ${totalStudents}`);
        for (const [field, group] of Object.entries(studGroup)) {
          const Names = group.map((student) => student.firstname).join(', ');
          preports.push(`Number of students in ${field}: ${group.length}. List: ${Names}`);
        }
        resolve(preports.join('\n'));
      }
    });
  }
});

app.get('/', (_, res) => {
  res.send('Hello Holberton School!');
});

app.get('/students', (_, res) => {
  const presponse = ['This is the list of our students'];

  countStudents(DB_FILE)
    .then((report) => {
      presponse.push(report);
      const responseText = presponse.join('\n');
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Length', responseText.length);
      res.statusCode = 200;
      res.write(Buffer.from(responseText));
    })
    .catch((err) => {
      presponse.push(err instanceof Error ? err.message : err.toString());
      const responseText = presponse.join('\n');
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Length', responseText.length);
      res.statusCode = 200;
      res.write(Buffer.from(responseText));
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});

module.exports = app;
