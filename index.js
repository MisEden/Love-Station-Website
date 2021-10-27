
var express = require('express');

const app = express();

app.use('/user', express.static('user'));
app.use('/referral', express.static('referral'));
app.use('/landlord', express.static('landlord'));
app.use('/volunteer', express.static('volunteer'));
app.use('/firm', express.static('firm'));
app.use('/admin', express.static('admin'));

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 81, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
});

