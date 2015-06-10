var llpaycashpay = require('../lib/llpaycashpay');
var config = require('../lib/config');
var should = require('should');
var muk = require('muk');
var request = require('request');
describe('#doPay()',function(){
	describe('should ok',function(){
		var llpaycashpayInstance = new llpaycashpay({
			oid_partner:"2015****",
			key:"test",
			sign_type:"RSA",		
			yt_pub_key:config.yt_pub_key,
			trader_pri_key:config.trader_pri_key,
			notify_url:"http://58.67.144.241:8007/withdraw/llpay"
		});
		before(function(){
			muk(request,'post',function(json, callback){
				describe('#json.url should be "https://yintong.com.cn/traderapi/cardandpay.htm"#',function(){
					var body = JSON.parse(json.body);
					// console.log(body);
					//认证的地址必须是"https://yintong.com.cn/traderapi/cardandpay.htm"
					it('url should ok',function(){
						json.url.should.be.equal("https://yintong.com.cn/traderapi/cardandpay.htm");				
					});
					it('sign_type should ok',function(){
						body.sign_type.should.be.equal('RSA');
					});
					it('sign should ok',function(){
						body.sign.should.be.equal("p6kfd130tucvy02lYWJNg96H3jIIJirSN2Cn9oWFqK4s4Zo1fDgQgsPkbGwE/S4cGKMfXfCnLvBTvq1DQ3QGh4N8atzLGDW9iWgH85uraOrdqL2qPoQYayVOCTmCmZkd5PvvX4Xkc8WHyy375Un5X+RblZm10+GZX7Z7VDmDil8=");
					})
				});			
				var res = {
					"ret_code":"0000",
					"ret_msg":"交易成功",
					"sign_type":"RSA",
					"sign":"ZPZULntRpJwFmGNIVKwjLEF2Tze7bqs60rxQ22CqT5J1UlvGo575QK9z/+p+7E9cOoRoWzqR6xHZ6WVv3dloyGKDR0btvrdqPgUAoeaX/YOWzTh00vwcQ+HBtXE+vPTfAqjCTxiiSJEOY7ATCF1q7iP3sfQxhS0nDUug1LP3OLk="
				};
				process.nextTick(function(){
					callback(null,{statusCode:200},JSON.stringify(res));
				})
			})
		});
		after(function(){
			muk.restore();
		});
		// new version,新商户的商户号是以W开头
		it('doPay should ok',function(done){
			llpaycashpayInstance.doPay({
				no_order:"123456789navy_test_withdraw",
				dt_order:"20150609110000",
				money_order:1,
				flag_card:"0",
				card_no:"6227****",
				acct_name:"谢**",
				info_order:"test"
			},function(err,data){
				data.should.have.properties(['ret_code','ret_msg','sign_type','sign']);
				done(err);
			})
		})
	});
});
describe('#doQuery()',function(){
	describe('should ok',function(){
		var llpaycashpayInstance = new llpaycashpay({
			oid_partner:"2015****",
			key:"test",
			sign_type:"MD5",		
			yt_pub_key:config.yt_pub_key,
			trader_pri_key:config.trader_pri_key,
			notify_url:"http://58.67.144.241:8007/withdraw/llpay"
		});
		before(function(){
			muk(request,'post',function(json, callback){
				describe('#json.url should be "https://yintong.com.cn/traderapi/orderquery.htm"#',function(){
					var body = JSON.parse(json.body);
					// console.log(body);
					//地址必须是"https://yintong.com.cn/traderapi/orderquery.htm"
					it('url should ok',function(){
						json.url.should.be.equal("https://yintong.com.cn/traderapi/orderquery.htm");				
					});
					it('sign_type should ok',function(){
						body.sign_type.should.be.equal('MD5');
					});
					it('sign should ok',function(){
						body.sign.should.be.equal("74663c859f8b3599b56d2b3aa79dff59");
					})
				});			
				var res = {
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
					"sign":"ZPZULntRpJwFmGNIVKwjLEF2Tze7bqs60rxQ22CqT5J1UlvGo575QK9z/+p+7E9cOoRoWzqR6xHZ6WVv3dloyGKDR0btvrdqPgUAoeaX/YOWzTh00vwcQ+HBtXE+vPTfAqjCTxiiSJEOY7ATCF1q7iP3sfQxhS0nDUug1LP3OLk="
				};
				process.nextTick(function(){
					callback(null,{statusCode:200},JSON.stringify(res));
				})
			})
		});
		after(function(){
			muk.restore();
		});
		it('doAuth new version should ok',function(done){
			llpaycashpayInstance.doQuery({
				no_order:"123456789panting_test_withdraw"
			},function(err,data){
				data.should.have.properties(['oid_partner','dt_order','no_order','result_pay','oid_paybill','money_order','settle_date','bank_code','sign','sign_type']);
				done(err);
			})
		})
	});
});