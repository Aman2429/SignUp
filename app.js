// requiring express (for building web app), bodyparser(for getting the data from the form that the user has typed),https(provides 
// a way of posting data over the HTTPS).
const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");

const app=express();




//this is used so ast to receive the input data from the browser form
app.use(bodyParser.urlencoded({extended: true}));




// when user enters our web app url this method is used to provide our root site  (get method is used to request data from the serveror any resource) 
app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/index.html");
});



// this is a request handler from the web in this we collect data from the user input and the send it to the mailchimp server , 
// at this stage it is data processsing   (post method send data to a server)
app.post("/",function(req,res)
{
   
    // geting the data from the user input and request body
    const Fname=(req.body.firstName);
    const Lname=(req.body.lastName);
    const mail=(req.body.email);


//creating the javascript object to post the data , since mailchimp accept in this format
    const data={
        members: [
            {
                email_address:mail,
                status:"subscribed",
                merge_fields:{
                    FNAME:Fname,
                    LNAME:Lname
                }
            }
        ]
    }


// creating the json string of the data which is a javascript object
    var JSONdata=JSON.stringify(data);

    // creating the parameters for getting the data from mailchimp.com
    const url="https://us11.api.mailchimp.com/3.0/lists/98ff2525bc";
    
    const options={
        method:"POST",
        auth:"Aman1:d5b60070a7c8c8f28405207a327a4eca-us11"
    }

    //to upload our data on to the chimpmail server the function is call back function response store data from the mailchimp
    const request=https.request(url,options,function(response) 
    {
        if (response.statusCode===200)
        {
            res.sendFile(__dirname+"/success.html");
        }
        else
        {
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data",function(data)
        {
            console.log(JSON.parse(data))
        });
    });

    request.write(JSONdata);
    request.end();
});


// another post method to handle the falure page and re route to signing up page(the data comes from failure route)
app.post("/failure",function(req,res)
{
    res.redirect("/");
}); 



// this help in using static files in the web aplication 
app.use(express.static('public'));



// this helps in hosting the site at web on port number 3000 locally
app.listen(3000,function()
{
    console.log("the server is active on port 3000");
});


