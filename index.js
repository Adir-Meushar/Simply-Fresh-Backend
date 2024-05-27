const dotenv = require('dotenv');
const express=require('express');
const cors =require('cors');
const mongoose=require('mongoose');
const chalk=require('chalk'); 
const loggerMiddleware=require('./handlers/helpers/logger');
const port = process.env.PORT || 5000;
const env = dotenv.config({ path: './prod.env' }); // for mongoDb Atlas use path: './prod.env'

async function main(){
    await mongoose.connect(env.parsed.REMOTE_URL);  
    console.log(chalk.blue('Connection Established')); 
} 
main().catch(err=>console.log(chalk.red(err))); 

const app=express();   

app.use(express.json()); 

app.use(cors({ 
    origin: true,  
    credentials: true, 
    methods: 'GET,PUT,POST,DELETE,OPTIONS,PATCH',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));
 
app.use(loggerMiddleware);
 
app.listen(port,()=>{ 
    console.log(chalk.blue((`Listening to port ${port}`))); 
});

app.use(express.static("public"));

require('./handlers/authentication/signup')(app);
require('./handlers/authentication/login')(app);
require('./handlers/user/user')(app);
require('./handlers/products/product')(app);
require('./handlers/products/category')(app);
require('./handlers/order/order')(app);
require('./handlers/adminData/dashboard')(app)
require('./handlers/initialData/initialDataService');

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/public/pageNotFound.html`);
 }); 