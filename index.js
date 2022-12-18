const express=require('express');
const port=8000;
const app=express();
const expressLayouts=require('express-ejs-layouts');

app.use(expressLayouts);
app.use(express.static('./assets'));

//extract style and script from sub page into the layout
app.set("layout extractStyles",true);
app.set("layout extractScripts",true);

//use express router
app.use('/',require('./routes/index'));
app.use('/user',require('./routes/user' ));

//set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

app.use(express.static('assets'));

app.listen(port,function(err){
    if(err){
        console.log(`Error is on server ,${err}`);
        return;
    }

    console.log(`Server is running on  port :${port}`);
})