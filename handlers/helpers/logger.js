const fs = require('fs');
const moment = require('moment');
const chalk = require('chalk');

module.exports = (req, res, next) => {
  const startTime = Date.now();
  const fileName = `./logs/log_${moment().format("Y_M_D")}.txt`;
  const localTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' });
  // Store the original end function to call it later
  const originalEnd = res.end;

  // Override res.end to log the status code
    res.end = (chunk, encoding) => {
    res.end = originalEnd; // Restore the original end function
    res.end(chunk, encoding); // Call the original end function

    // Log the status code after the response has been sent
    const endTime = Date.now();
    const duration = endTime - startTime;

    let content = ''; 
    content += `Time: ${localTime}\n`;
    content += `Method: ${req.method}\n`;
    content += `Route: ${req.url}\n`;
    content += `Status: ${res.statusCode}\n`;
    content += `Duration: ${duration}ms\n`;
   
    if (res.statusCode === 200) {
      console.log(chalk.green(content));
    } else if (String(res.statusCode).startsWith('4')) {
      console.log(chalk.red(content)); 
    } else {
      console.log(content);
    }
    if (res.statusCode >= 400) {
      content += `Error Msg: ${res.statusMessage}\n\n`;
      fs.appendFile(fileName, content, (err) => {
        if (err) {
          console.error(chalk.red(`Error writing to log file: ${err.message}`));
        } else {
          console.log(chalk.green(`Log entry added to ${fileName}`));
        }
      });
    }
    }
  next();
};

