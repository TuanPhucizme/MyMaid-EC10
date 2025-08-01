let express = require('express');
let router = express.Router();
const request = require('request');
const moment = require('moment');
const crypto = require("crypto");
// Giả sử file config của bạn ở thư mục gốc
const config = require('../config/default.json'); // Điều chỉnh đường dẫn nếu cần
const querystring = require('qs');

// Hàm tiện ích để sắp xếp object
function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

/**
 * @route   POST /api/payment/create_payment_url
 * @desc    Tạo mới URL thanh toán
 * @access  Public
 */
router.post('/create_payment_url', function (req, res, next) {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let tmnCode = config.vnp_TmnCode;
    let secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    // URL trả về sẽ là trang kết quả trên React
    let returnUrl = 'http://localhost:3000/payment-result'; 
    let orderId = moment(date).format('DDHHmmss');
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    
    let locale = req.body.language;
    if(locale === null || locale === ''){
        locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    // THAY ĐỔI QUAN TRỌNG: Trả về URL cho React xử lý
    res.json({ paymentUrl: vnpUrl });
});

/**
 * @route   GET /api/payment/vnpay_return
 * @desc    Xử lý kết quả VNPAY trả về
 * @access  Public
 */
router.get('/vnpay_return', function (req, res, next) {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let secretKey = config.vnp_HashSecret;
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

    if (secureHash === signed) {
        // Chuyển hướng về trang React với các tham số để hiển thị kết quả
        const redirectParams = querystring.stringify(vnp_Params, { encode: false });
        res.redirect(`http://localhost:3000/payment-result?${redirectParams}`);
    } else {
        // Chuyển hướng về trang React với thông báo lỗi
        res.redirect(`http://localhost:3000/payment-result?vnp_ResponseCode=97`);
    }
});


/**
 * @route   GET /api/payment/vnpay_ipn
 * @desc    Xử lý IPN từ VNPAY (cập nhật DB)
 * @access  Public
 */
router.get('/vnpay_ipn', function (req, res, next) {
    // Logic IPN giữ nguyên để cập nhật trạng thái đơn hàng trong DB
    // ... (giữ nguyên code của bạn)
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];
    
    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = config.vnp_HashSecret;
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
    
    let checkOrderId = true; 
    let checkAmount = true;
    if(secureHash === signed){
        if(checkOrderId){
            if(checkAmount){
                // Logic cập nhật DB của bạn ở đây
                res.status(200).json({RspCode: '00', Message: 'Success'})
            }
            // ...
        }
    } else {
        res.status(200).json({RspCode: '97', Message: 'Checksum failed'})
    }
});


module.exports = router;