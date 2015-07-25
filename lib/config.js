module.exports = {
	//↓↓↓↓↓↓↓↓↓↓请在这里配置您的基本信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
	oid_partner:"",//商户编号是商户在连连钱包支付平台上开设的商户号码，为18位数字，如：201306081000001016
	key:"",//安全检验码，以数字和字母组成的字符
	//↑↑↑↑↑↑↑↑↑↑请在这里配置您的基本信息↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
	api_version:"1.2",//版本号
	sign_type:"RSA",//签名方式,MD5 or RSA
	input_charset:"utf-8",//字符编码格式 目前支持 gbk 或 utf-8
	yt_pub_key:"",// 银通公钥  
	trader_pri_key:"",// 商户私钥
	notify_url:"",// 接收异步通知地址
	info_order:"考拉理财,开启懒人理财生活。",
	query_version:'1.1',
	type_dc:'1'
}
