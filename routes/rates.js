var express = require('express');
var request = require('request');
var router = express.Router();
var zoomBtcUrl = 'https://www.cryptonator.com/api/ticker/zoom-btc';
var bitpayUrl = 'https://bitpay.com/api/rates';
var zoomData = request(zoomBtcUrl, function (error, response) {});
var bitpayData = request(bitpayUrl, function (error, response) {});
router.get('/', function(req, res) {
  zoomParsed = JSON.parse(zoomData.response.body);
  zoomPrice = zoomParsed.ticker.price;
  bpayParsed = JSON.parse(bitpayData.response.body);
  var json=[];
  for(var i in bpayParsed)
  {
      var temp={};
      temp['code']=bpayParsed[i].code;
      temp['name']=bpayParsed[i].name;
      temp['rate']=bpayParsed[i].rate * zoomPrice;
     json.push(temp);
  }

  var stringJson = JSON.stringify(json);
  //res.set('Access-Control-Allow-Origin', '*')
  res.set('Content-Type', 'application/json');
  res.write(stringJson);
  res.end();
});
var findCurrency = function (currency, callback) {
  zoomParsed = JSON.parse(zoomData.response.body);
  zoomPrice = zoomParsed.ticker.price;
  bpayParsed = JSON.parse(bitpayData.response.body);
  var json=[];
  for(var i in bpayParsed)
  {
    var temp={};
    if (bpayParsed[i].code == currency.toUpperCase()){
        temp['code']=bpayParsed[i].code;
        temp['name']=bpayParsed[i].name;
        temp['rate']=bpayParsed[i].rate * zoomPrice;
        json.push(temp);
    }
  }

  var stringJson = JSON.stringify(json);
  console.log(stringJson)
  return callback(null, stringJson);
};

router.get('/:currency', function(request, response, next) {
  var currency = request.params.currency;
  findCurrency(currency, function(error, fiat) {
    if (error) return next(error);
    return response.send(fiat);
  });
});
module.exports = router;
