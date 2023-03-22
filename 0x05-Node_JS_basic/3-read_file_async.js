const fs = require('fs');

const countStudents = (argPath) => new Promise((resolve, reject) => {
  fs.readFile(argPath, 'utf-8', (err, data) => {
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

      const totalStudents = Object
        .values(studGroup)
        .reduce((pre, cur) => (pre || []).length + cur.length);
      console.log(`Number of students: ${totalStudents}`);
      for (const [field, group] of Object.entries(studGroup)) {
        const Names = group.map((student) => student.firstname).join(', ');
        console.log(`Number of students in ${field}: ${group.length}. List: ${Names}`);
      }
      resolve(true);
    }
  });
});

module.exports = countStudents;
