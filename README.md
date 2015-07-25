# 连连代付 / 提现 SDK

## API

[`doPay`](#dopay)

[`doQuery`](#doQuery)

### Demo:

<a name="dopay" />

### 提现接口

```js	
var llpaycashpay = require('llpaycashpay');	
var llpaycahpayInstance = new llpaycahpay({
	key:"test",
	oid_partner: "2015***",
	yt_pub_key:"*****",
	trader_pri_key:"M***",
	notify_url:"http://***/withdraw/llpay"
});
llpaycahpayInstance.doPay({
	no_order:"123456789navy_test_withdraw",
	dt_order:"20150609110000",
	money_order:1,
	flag_card:"0",
	card_no:"6227***",
	acct_name:"***",
	info_order:"test"
},function(err,data){
	if(!err){
		data => {
			"oid_partner":"201103171000000000",
			"money_order":"200.01",
			"dt_order":"20130515094013",
			"no_order":"2013051500001",
			"notify_url":"http://payhttp.xiaofubao.com/***/refund.htm",
			"sign_type ":"RSA",
			"sign":"ZPZULntRpJwFmGNIVKwjLEF2Tze7bqs60rxQ22CqT5J1UlvGo575QK9z/
		}
		console.log(data);
	}
});
```

<a name="doQuery" />

### 提现查询接口

```js
llpaycahpayInstance.doQuery({
	no_order:"123456789panting_test_withdraw"
},function(err,data){
	if(!err){
		data = > {
			"oid_partner":"201103171000000000",
			"dt_order":"20130515094013",
			"no_order":"2013051500001",
			"result_pay":"SUCCESS",
			"oid_paybill":"2013051500001",
			"money_order":"49.65",
			"settle_date":"20130515",
			"info_order":"用户13958069593购买了3桶羽毛球",
			"pay_type":"2",
			"bank_code":"01020000",
			"sign_type":"RSA",
			"sign":"ZPZULntRpJwFmGNIVKwjLEF2Tze7bqs60rxQ22CqT5J1UlvGo575QK9z/
			+p+7E9cOoRoWzqR6xHZ6WVv3dloyGKDR0btvrdqPgUAoeaX/YOWzTh00vwcQ+HBtXE+vP
			TfAqjCTxiiSJEOY7ATCF1q7iP3sfQxhS0nDUug1LP3OLk="
		}
		if(llpaycahpayInstance.verify(data)){
			//todo
			console.log(data);
		}else{
			console.log('数据被篡改');
		}
	}
});
//异步回调处理,notify_url,假定data为回调的数据
data = > {
	"oid_partner":"201103171000000000",
	"dt_order":"20130515094013",
	"no_order":"2013051500001",
	"result_pay":"SUCCESS",
	"oid_paybill":"2013051500001",
	"money_order":"49.65",
	"settle_date":"20130515",
	"info_order":"用户13958069593购买了3桶羽毛球",
	"pay_type":"2",
	"bank_code":"01020000",
	"sign_type":"RSA",
	"sign":"ZPZULntRpJwFmGNIVKwjLEF2Tze7bqs60rxQ22CqT5J1UlvGo575QK9z/
	+p+7E9cOoRoWzqR6xHZ6WVv3dloyGKDR0btvrdqPgUAoeaX/YOWzTh00vwcQ+HBtXE+vP
	TfAqjCTxiiSJEOY7ATCF1q7iP3sfQxhS0nDUug1LP3OLk="
}
if(llpaycahpayInstance.verify(data)){
	//todo
	console.log(data);
}else{
	console.log('数据被篡改');
} 
```
