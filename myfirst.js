var http = require('http');
var url = require('url');
var fs = require('fs');
var nodemailer = require('nodemailer');

var dt = require('./firstmodule');


// http.createServer((req, res) => {

//     res.writeHead(200, {'Content-Type': 'text/html'});

//     res.write("Current date & time: " + dt.myDateTime());

//     var q = url.parse(req.url, true).query;
//     var text = q.year + " " + q.month;
//     res.write("now another time and date: " + text);

//     //THIS DOESNT WORK
//     // fs.readFile('index.html', (err,data) => {
//     //     //if (err) { throw err; }
//     //     res.write(data);
//     // });

//     res.end(); //ends the response
// }).listen(8080);

// //access and return the content of a file with path specified in url params
// http.createServer( (req, res) => {

//     var params = url.parse(req.url, true);
//     var fname = "." + params.pathname; //params.argname can access any parameter given in the url now

//     fs.readFile(fname, (err, data) => {
//         if (err){
//             res.writeHead(404, {'Content-Type': 'text/html'});
//             return res.end("404 The specified path leads to no file");
//         }
        
//         res.writeHead(200, {'Content-Type': 'text/html'});
//         res.write(data);

//         return res.end();
//     });
// }).listen(8080);


//get email and text from get params and send an email!
//this is done with a testing account
http.createServer((req, res) => {

    var params = url.parse(req.url, true).query;
    var subj = params.subj;
    var text = params.text;
    var restxt = "";

    
    if(text != undefined){

        if (!subj){
            subj = "No Subject";
        }

        nodemailer.createTestAccount((err, testAccount) => {
            if (err) {
                console.error('Failed to create a testing account. ' + err.message);
                return process.exit(1);
            }

            let transporter = nodemailer.createTransport({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: false,
                auth:{
                    user: testAccount.user,
                    pass: testAccount.pass,
                }
            });

            let mailopt = {
                from: '"gianluca" <gianluca123151513s@example.com>',
                to: 'fakeaccount@fakkkke.it',
                subject: subj,
                text: text,
                html: '<p><b>Hello</b> this is my nodejsapp</p>'
            };

            transporter.sendMail(mailopt, (err, info) => {
                if(err) {
                    res.writeHead(300, {'Content-Type': 'text/html'});
                    restxt = "An error occurred while sending the email: " + err;
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    restxt = "the email has been sent successfully: " + info.response;
                }
                console.log(restxt);
            });
        });
        
    } else {
        res.writeHead(300, {'Content-Type': 'text/html'});
        restxt = "no text specified for the email!";
    }

    console.log(restxt);
    res.end(restxt);
}).listen(8080);
