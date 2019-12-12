const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const ndjson = require('ndjson');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api', (req, res) => {
  let readStream = fs.createReadStream(__dirname+'/todos.ndjson')
    .pipe(ndjson.parse());

  const chunks = [];

  readStream.on('data', (data)=> {
    chunks.push(JSON.stringify(data));
  });

  readStream.on('end', ()=> {
    var id = setInterval(()=> {
      if (chunks.length) {
        res.write(chunks.shift()+'\n');
      }else{
        clearInterval(id);
      }
    }, 500);
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
