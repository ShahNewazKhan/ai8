var sphero = require("sphero"),
bb8 = sphero("b2f945ecaaf342d49c78d7f31c4b5c90"); // change BLE address accordingly 

console.log('initiating connection ... ')
bb8.connect(function()
{
    console.debug('connected to bb8')
    
    bb8.ping(function(err, data) {
        console.log(err || "data: " + data);
    })

    //discon();
})

var discon = function(){
    bb8.disconnect(function() {
        console.log("disconnecting ...");
    })
}