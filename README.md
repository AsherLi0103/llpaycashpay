# 连连代付 / 提现 SDK

## API

[`doPay`](#dopay)

[`doQuery`](#doQuery)

[`verify`](#verify)

[`success`](#success)

[`submitSuccess`](#submitSuccess)

[`getStopNotifyData`](#getStopNotifyData)

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

<a name="verify" />

### 对连连代付返回(同步或异步)的数据进行认证

```js
llpaycahpayInstance.verify({
	ret_code: '0000',
	ret_msg: '交易成功',
	sign: 'C2KGixCDyCAqD9/fjU06WBog4MLrKOAZfDkhPkmDIJbQ2mN2/ykdSIX3OiKxcNkouvLwjHUsKDc5EHET/CERDqyWIcvtad9KPIdK0sX67teXw2Rqv2gf5ebVEjXpr+wI33L1efOqMQSh8jBheuzhM0lgio/XUXNoXHNwtKK4nxU=',
	sign_type: 'RSA'
})
```

<a name="success" />

### 异步返回结果字段result_pay必须是SUCCESS才表示支付成功。

```js
//data为代付异步返回的结果
if(llpaycahpayInstance.success(data)){
	//todo,更新提现订单....
}
```

<a name="submitSuccess" />

### 提现请求提交成功

```js
//data为代付同步返回的结果
if(llpaycahpayInstance.submitSuccess(data)){
	//todo,更新提现订单....
}
```

<a name="getStopNotifyData" />

### 获取停止回调数据

```js
//商户返回这个就会停止连连代付的异步回调
res.json(200,llpaycahpayInstance.getStopNotifyData());
```