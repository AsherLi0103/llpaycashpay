var config = require('./config');
var util = require('./util');
var url = require('./serverurlconfig');
var digest = require('./digest');
var defaultKeys = ['oid_partner','sign_type','api_version'];//获取配置中默认参数
var keys = ['oid_partner','sign_type','no_order','dt_order','money_order','flag_card','card_no','acct_name','info_order','notify_url','api_version'];//必填参数,注意，sign参数是通过其他参数生成的，所以这里不需要写
var optionKeys = ['platform','bank_code','province_code','city_code','brabank_name','prcptcd'];//可选参数
/**
*支付前先检测参数是否合法
*/
function checkParam(data){
	for(var i = 0 , len = keys.length ; i < len ; i++){
		if(!data.hasOwnProperty(keys[i]) || !data[keys[i]]){
			return false;
		}
	}
	return true;
}
/**
*获取配置中的常量
*@param object data
*return object
*/
function defaultKeysValue(){
	var result = {};
	for(var i = 0 , len = defaultKeys.length ; i < len ; i++){
		if(config[defaultKeys[i]]){
			result[defaultKeys[i]] = config[defaultKeys[i]];
		}
	}
	return result;
}
/**
*检查时间格式是否正确，14位
*@param time string
*return boolean
*/
function checkTime(time){
	return time && time.length === 14
}
/**
*连连支付类
*#################
*json:{oid_partner:'',key:'',sign_type:'',busi_partner:'',notify_url:'',url_return:''}
*#################
*/
function llpaycashpay(json){
	var cloneConfig = util.clone(config);
	this.config = util.extend(cloneConfig,json);
}
/**
*
*@param object jsonData
*return cb 
//******************
*#################
*/
llpaycashpay.prototype.doPay = function(json,cb){
	this.config = util.extend(this.config,json);
	var defaultValue = util.clone(defaultKeysValue());
	var cloneConfig = util.clone(this.config);
	json = util.extend(cloneConfig,json);
	json = util.extend(defaultValue,json);	
	//检测参数是否齐全
	if(!checkParam(json)){
		return cb("参数错误，请检查！");
	}
	json = util.pick(json,keys.concat(optionKeys));//拾取连连支付所支持的参数
	var obj = this._buildRequestPara(json);
	var request = require('request');
	// console.log('request---------------');
	// console.log(obj);
	// console.log('url:'+url.card_and_pay_url);
	request.post({url:url.card_and_pay_url,body:JSON.stringify(obj)},function(error, response, body){
		if(!error && response.statusCode === 200){
			cb(null,JSON.parse(body));
		}else{
			cb(error, response, body);
		}	
	})
}

/**
*
*@param object jsonData
*return cb 
//******************
*#################
*/
llpaycashpay.prototype.doQuery = function(json,cb){
	var defaultValue = util.clone(defaultKeysValue());
	var cloneConfig = util.clone(this.config);
	json = util.extend(cloneConfig,json);
	json = util.extend(defaultValue,json);
	//检测参数是否齐全
	if(!json.no_order){
		return cb("参数错误，请检查！");
	}
	json = util.pick(json,['oid_partner','sign_type','sign','no_order','dt_order','oid_paybill','type_dc','query_version']);//拾取连连支付所支持的参数
	var obj = this._buildRequestPara(json);
	var request = require('request');
	request.post({url:url.query_pay_url,body:JSON.stringify(obj)},function(error, response, body){
		if(!error && response.statusCode === 200){
			cb(null,JSON.parse(body));
		}else{
			cb(error, response, body);
		}	
	})
}

/**
 * 生成要请求给连连支付的参数数组
 * @param $para_temp 请求前的参数数组
 * @return 要请求的参数数组
 */
llpaycashpay.prototype._buildRequestPara = function(para_temp) {
	//除去待签名参数数组中的空值和签名参数
	var para_filter = util.paraFilter(para_temp);
	//对待签名参数数组排序
	var para_sort = util.sortObjectByKey(para_filter);
	//生成签名结果
	var mysign = this._buildRequestMysign(para_sort);
	//签名结果与签名方式加入请求提交参数组中
	para_sort['sign'] = mysign;
	para_sort['sign_type'] = this.config['sign_type'].toUpperCase();
	return para_sort;
}
/**
 * 生成签名结果
 * @param $para_sort 已排序要签名的数组
 * return 签名结果字符串
 */
llpaycashpay.prototype._buildRequestMysign = function(para_sort){
	//把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
	var prestr = util.jsonToSearch(para_sort);
	var signType = this.config['sign_type'].trim().toUpperCase();
	var mysign = "";
	switch(signType){
		case "MD5" :
			mysign = digest.md5Sign(prestr, this.config['key']);
			break;
		case "RSA" :
			mysign = digest.Rsasign(prestr, this.config['trader_pri_key'],'MD5');
			break;
		default :
			mysign = "";
	}
	return mysign;
}
/**
 * 对连连支付返回的数据进行认证
 * @param json object
 * return boolean
 */
llpaycashpay.prototype.verify = function(json){
	var result = util.clone(json);
	var sign = result.sign;
	var sign_type = result.sign_type;
	if(!sign){
		return false;
	}
	delete result.sign;
	
	var para_sort = util.sortObjectByKey(result);

	var prestr = util.jsonToSearch(para_sort);
	var signType = this.config['sign_type'].trim().toUpperCase();
	signType = sign_type || signType;
	if(signType === 'MD5'){
		return digest.md5Verify(prestr,sign,this.config.key);
	}else{
		return digest.Rsaverify(prestr,sign,this.config.yt_pub_key,'MD5');
	}
	
}
/**
 * 返回结果字段result_pay必须是SUCCESS才表示支付成功。
 * @param json object
 * return boolean
 */
llpaycashpay.prototype.success = function(result){
	return result.result_pay === 'SUCCESS';
}
//提现请求提交成功
llpaycashpay.prototype.submitSuccess = function(result){
	return result.ret_code === '0000';
}
//获取停止回调数据
llpaycashpay.prototype.getStopNotifyData = function(result){
	return {
		ret_code:"0000",
		ret_msg:"交易成功"
	};
}
Object.defineProperty(llpaycashpay, "UTIL", {
  get: function () {
    return util;
  }
});
Object.defineProperty(llpaycashpay, "DIGEST", {
  get: function () {
    return digest;
  }
});
module.exports = llpaycashpay;