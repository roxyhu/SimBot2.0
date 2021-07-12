const spawn = require('child_process').spawn;
let ABC="I want to drink juice"

function printLabel() {
    return spawn('python', ["./load.py",ABC]);
  }
  const data = printLabel();
  data.stdout.on('data', data => {
    console.log(data.toString());
    // document.getElementById("questionid").value = datasound.toString();
  });