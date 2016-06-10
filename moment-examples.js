var moment = require('moment');
var now = moment();

console.log(now.format('X'));

On a side note, moment outputs strings - so comparisons are not going to work like this. We'll need to convert 
our output to a javascript timestamp. Write this: <code>console.log(now.valueOf());</code>. You'll get a number you can 
do comparisons with. 

The server is going to send a timestamp to a client that needs to know how to deal with it. In chat apps, it 
is important to deal with timezones. UNIX timestamps make that easy when used with MomentJS. 
We can access the utc property of moment like this: <code>moment.utc(timestamp);</code>

console.log(timestampMoment.local.format('h:mm a'))