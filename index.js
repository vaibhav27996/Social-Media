const express=require('express');
const port=8000;

const app=express();

//use express router
app.use('/',require('./routes/index'));
app.use('/user',require('./routes/user' ));

app.set('view engine','ejs');
app.set('views','./views');

app.listen(port,function(err){
    if(err){
        console.log(`Error is on server ,${err}`);
        return;
    }

    console.log(`Server is running on  port :${port}`);
})