let express = require('express');
let router = express.Router();
const request = require('request');
const moment = require('moment');
const crypto = require("crypto");
const config = require('../config/default.json'); // Điều chỉnh đường dẫn nếu cần
const querystring = require('qs');
const { db } = require('../config/firebaseAdmin');
const { notifyPartnersAboutNewOrder } = require('../services/partnerNotificationService');

// Hàm tiện ích để sắp xếp object
function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
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
    // Đơn giản hóa: Return URL trỏ đến server để xử lý trước khi redirect về client
    let returnUrl = process.env.NODE_ENV === 'production'
        ? 'https://mymaid-ec10-api.onrender.com/api/payment/vnpay_return'
        : 'http://localhost:5000/api/payment/vnpay_return';
    // Đơn giản hóa: Không cần IPN URL, chỉ dùng return URL
    let orderId = moment(date).format('DDHHmmss');
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;

    // Lưu order ID để tracking sau này
    let orderDbId = req.body.orderDbId;

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
    vnp_Params['vnp_OrderInfo'] = orderDbId ? `Thanh toan don hang ${orderDbId}` : 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    // Không cần IPN URL nữa - đơn giản hóa
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    // THAY ĐỔI QUAN TRỌNG: Trả về URL cho React xử lý
    res.json({ 
        paymentUrl: vnpUrl,
        vnpayOrderId: orderId,
        orderDbId: orderDbId
    });
});

/**
 * @route   GET /api/payment/vnpay_return
 * @desc    Xử lý kết quả VNPAY trả về
 * @access  Public
 */
// Đơn giản hóa VNPay return - không cần signature verification
router.get('/vnpay_return', async function (req, res, next) {
    try {
        console.log('🔔 VNPay return received:', req.query);

        const vnp_Params = req.query;
        const rspCode = vnp_Params.vnp_ResponseCode;
        const orderInfo = vnp_Params.vnp_OrderInfo;
        const transactionNo = vnp_Params.vnp_TransactionNo;

        // Extract order ID từ orderInfo
        let orderDbId = null;
        if (orderInfo && orderInfo.includes('Thanh toan don hang ')) {
            orderDbId = orderInfo.replace('Thanh toan don hang ', '');
        }

        // Nếu payment thành công, update order luôn
        if (rspCode === '00' && orderDbId) {
            console.log('✅ VNPay payment successful, updating order:', orderDbId);

            const orderRef = db.collection('orders').doc(orderDbId);
            const orderDoc = await orderRef.get();

            if (orderDoc.exists) {
                const orderData = orderDoc.data();

                if (orderData.status === 'pending_payment') {
                    await orderRef.update({
                        status: 'confirmed',
                        'payment.status': 'completed',
                        'payment.paidAt': new Date(),
                        'payment.vnpayTransactionId': transactionNo,
                        'payment.vnpayResponseCode': rspCode,
                        statusHistory: [...(orderData.statusHistory || []), {
                            status: 'confirmed',
                            timestamp: new Date(),
                            note: 'Thanh toán VNPay thành công - Return URL'
                        }],
                        updatedAt: new Date()
                    });

                    console.log('✅ Order updated successfully via return URL');
                }
            }
        }

        // Chuyển hướng về React với tất cả params
        const redirectParams = querystring.stringify(vnp_Params, { encode: false });
        const redirectUrl = process.env.NODE_ENV === 'production'
            ? `https://mymaid-ec10.onrender.com/payment-result?${redirectParams}`
            : `http://localhost:3000/payment-result?${redirectParams}`;

        res.redirect(redirectUrl);

    } catch (error) {
        console.error('❌ Error in VNPay return:', error);
        const errorUrl = process.env.NODE_ENV === 'production'
            ? 'https://mymaid-ec10.onrender.com/payment-result?vnp_ResponseCode=99'
            : 'http://localhost:3000/payment-result?vnp_ResponseCode=99';
        res.redirect(errorUrl);
    }
});


/**
 * @route   GET /api/payment/vnpay_ipn
 * @desc    Xử lý IPN từ VNPAY (cập nhật DB)
 * @access  Public
 */
// Đơn giản hóa hoàn toàn VNPay IPN endpoint
router.get('/vnpay_ipn', async function (req, res, next) {
    try {
        console.log('🔔 SIMPLE VNPay IPN received:', req.query);

        const rspCode = req.query.vnp_ResponseCode;
        const transactionNo = req.query.vnp_TransactionNo;
        const orderInfo = req.query.vnp_OrderInfo;

        console.log('📋 Response Code:', rspCode);
        console.log('📋 Transaction No:', transactionNo);
        console.log('📋 Order Info:', orderInfo);

        // Extract order ID từ orderInfo
        let orderDbId = null;
        if (orderInfo && orderInfo.includes('Thanh toan don hang ')) {
            orderDbId = orderInfo.replace('Thanh toan don hang ', '');
        }

        if (!orderDbId) {
            console.error('❌ No order ID found');
            return res.status(200).json({RspCode: '02', Message: 'Order not found'});
        }

        // Chỉ xử lý khi payment thành công
        if (rspCode !== '00') {
            console.log('❌ Payment failed:', rspCode);
            return res.status(200).json({RspCode: '01', Message: 'Payment failed'});
        }

        console.log('✅ Payment successful, updating order:', orderDbId);

        // Update order trong database
        const orderRef = db.collection('orders').doc(orderDbId);
        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) {
            console.error('❌ Order not found in database');
            return res.status(200).json({RspCode: '02', Message: 'Order not found'});
        }

        const orderData = orderDoc.data();

        // Chỉ update nếu order đang pending
        if (orderData.status !== 'pending_payment') {
            console.log('⚠️ Order already processed');
            return res.status(200).json({RspCode: '00', Message: 'Already processed'});
        }

        // Update order thành confirmed
        await orderRef.update({
            status: 'confirmed',
            'payment.status': 'completed',
            'payment.paidAt': new Date(),
            'payment.vnpayTransactionId': transactionNo,
            'payment.vnpayResponseCode': rspCode,
            statusHistory: [...(orderData.statusHistory || []), {
                status: 'confirmed',
                timestamp: new Date(),
                note: 'Thanh toán VNPay thành công'
            }],
            updatedAt: new Date()
        });

        console.log('✅ Order confirmed successfully');
        return res.status(200).json({RspCode: '00', Message: 'Success'});

    } catch (error) {
        console.error('❌ IPN Error:', error);
        return res.status(200).json({RspCode: '99', Message: 'System error'});
    }
});

// Test endpoint mới để bypass cache
router.get('/vnpay_ipn_simple', async function (req, res) {
    try {
        console.log('🔔 SIMPLE IPN TEST received:', req.query);

        const rspCode = req.query.vnp_ResponseCode;
        const transactionNo = req.query.vnp_TransactionNo;
        const orderInfo = req.query.vnp_OrderInfo;

        console.log('📋 Response Code:', rspCode);
        console.log('📋 Transaction No:', transactionNo);
        console.log('📋 Order Info:', orderInfo);

        // Extract order ID từ orderInfo
        let orderDbId = null;
        if (orderInfo && orderInfo.includes('Thanh toan don hang ')) {
            orderDbId = orderInfo.replace('Thanh toan don hang ', '');
        }

        if (!orderDbId) {
            console.error('❌ No order ID found');
            return res.status(200).json({RspCode: '02', Message: 'Order not found'});
        }

        // Chỉ xử lý khi payment thành công
        if (rspCode !== '00') {
            console.log('❌ Payment failed:', rspCode);
            return res.status(200).json({RspCode: '01', Message: 'Payment failed'});
        }

        console.log('✅ Payment successful, updating order:', orderDbId);

        // Update order trong database
        const orderRef = db.collection('orders').doc(orderDbId);
        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) {
            console.error('❌ Order not found in database');
            return res.status(200).json({RspCode: '02', Message: 'Order not found'});
        }

        const orderData = orderDoc.data();

        // Chỉ update nếu order đang pending
        if (orderData.status !== 'pending_payment') {
            console.log('⚠️ Order already processed');
            return res.status(200).json({RspCode: '00', Message: 'Already processed'});
        }

        // Update order thành confirmed
        await orderRef.update({
            status: 'confirmed',
            'payment.status': 'completed',
            'payment.paidAt': new Date(),
            'payment.vnpayTransactionId': transactionNo,
            'payment.vnpayResponseCode': rspCode,
            statusHistory: [...(orderData.statusHistory || []), {
                status: 'confirmed',
                timestamp: new Date(),
                note: 'Thanh toán VNPay thành công - Simple endpoint'
            }],
            updatedAt: new Date()
        });

        console.log('✅ Order confirmed successfully via simple endpoint');
        return res.status(200).json({RspCode: '00', Message: 'Success'});

    } catch (error) {
        console.error('❌ Simple IPN Error:', error);
        return res.status(200).json({RspCode: '99', Message: 'System error'});
    }
});

// Test endpoint mới cho return URL
router.get('/vnpay_return_simple', async function (req, res) {
    try {
        console.log('🔔 SIMPLE VNPay return received:', req.query);

        const vnp_Params = req.query;
        const rspCode = vnp_Params.vnp_ResponseCode;
        const orderInfo = vnp_Params.vnp_OrderInfo;
        const transactionNo = vnp_Params.vnp_TransactionNo;

        console.log('📋 Response Code:', rspCode);
        console.log('📋 Order Info:', orderInfo);
        console.log('📋 Transaction No:', transactionNo);

        // Extract order ID từ orderInfo
        let orderDbId = null;
        if (orderInfo && orderInfo.includes('Thanh toan don hang ')) {
            orderDbId = orderInfo.replace('Thanh toan don hang ', '');
        }

        console.log('📋 Extracted Order ID:', orderDbId);

        // Nếu payment thành công, update order luôn
        if (rspCode === '00' && orderDbId) {
            console.log('✅ VNPay payment successful, updating order:', orderDbId);

            const orderRef = db.collection('orders').doc(orderDbId);
            const orderDoc = await orderRef.get();

            if (orderDoc.exists) {
                const orderData = orderDoc.data();
                console.log('📋 Current order status:', orderData.status);

                if (orderData.status === 'pending_payment') {
                    await orderRef.update({
                        status: 'confirmed',
                        'payment.status': 'completed',
                        'payment.paidAt': new Date(),
                        'payment.vnpayTransactionId': transactionNo,
                        'payment.vnpayResponseCode': rspCode,
                        statusHistory: [...(orderData.statusHistory || []), {
                            status: 'confirmed',
                            timestamp: new Date(),
                            note: 'Thanh toán VNPay thành công - Simple Return URL'
                        }],
                        updatedAt: new Date()
                    });

                    console.log('✅ Order updated successfully via simple return URL');
                } else {
                    console.log('⚠️ Order already processed:', orderData.status);
                }
            } else {
                console.log('❌ Order not found in database');
            }
        } else {
            console.log('❌ Payment failed or invalid order ID');
        }

        // Chuyển hướng về React với tất cả params
        const redirectParams = querystring.stringify(vnp_Params, { encode: false });
        const redirectUrl = `http://localhost:3000/payment-result?${redirectParams}`;

        console.log('🔄 Redirecting to:', redirectUrl);
        res.redirect(redirectUrl);

    } catch (error) {
        console.error('❌ Error in simple VNPay return:', error);
        res.redirect('http://localhost:3000/payment-result?vnp_ResponseCode=99');
    }
});

module.exports = router;