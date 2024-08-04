const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chalk = require('chalk'); 
const loggerMiddleware = require('./handlers/helpers/logger');
const port = process.env.PORT || 5000;
const path = require('path'); // Import the path module

// Load environment variables
dotenv.config();

async function main(){ 
    try {
        const remoteUrl = process.env.REMOTE_URL;
        if (!remoteUrl) {
            throw new Error ('REMOTE_URL environment variable not set');
        }
        await mongoose.connect(remoteUrl, {
            serverSelectionTimeoutMS: 30000, // 30 seconds 
        });
        console.log(chalk.blue('Connection Established')); 
    } catch (err) {
        console.error(chalk.red('Failed to connect to MongoDB'), err); 
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

app.use(express.static(path.join(__dirname, '..', 'public')));

require('./handlers/authentication/signup')(app);
require('./handlers/authentication/login')(app);
require('./handlers/user/user')(app);
require('./handlers/products/product')(app);
require('./handlers/products/category')(app);
require('./handlers/order/order')(app);
require('./handlers/adminData/dashboard')(app)
require('./handlers/initialData/initialDataService');

// Serve index.html for client-side routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Handle 404 errors for API routes
app.use((req, res, next) => {
    if (req.accepts('html')) {
        res.status(404).sendFile(path.join(__dirname, '..', 'public', 'pageNotFound.html'));
    } else {
        res.status(404).json({ error: 'Not Found' });
    }
});