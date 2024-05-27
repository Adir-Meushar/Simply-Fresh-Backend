const dotenv = require('dotenv');
const express=require('express');
const cors =require('cors');
const mongoose=require('mongoose');
const chalk=require('chalk'); 
const loggerMiddleware=require('./handlers/helpers/logger');
const port = process.env.PORT || 4000;
// const env = dotenv.config({ path: './prod.env' }); // for mongoDb Atlas use path: './prod.env'

async function main(){
    try{
        const remoteUrl = process.env.REMOTE_URL;
        if (!remoteUrl) {
            throw new Error('REMOTE_URL environment variable not set');
        }
        await mongoose.connect(remoteUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(chalk.blue('Connection Established')); 
    }catch(err){
        (err=>console.log(chalk.red(err))); 
    }
} 
main();        

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