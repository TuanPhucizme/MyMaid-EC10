const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { db } = require('../config/firebaseAdmin');

async function seed() {
	console.log('Seeding Firestore test data...');

	const testUserId = process.env.SEED_USER_ID || 'test-user-uid';
	const now = new Date();

	// 1) Ensure a test user profile exists (mm_users/{uid})
	const userDocRef = db.collection('mm_users').doc(testUserId);
	await userDocRef.set({
		name: 'Test Customer',
		email: 'test-customer@example.com',
		role: 'customer',
		status: 'active',
		createdAt: now
	}, { merge: true });
	console.log(`✔ Created/updated test user profile mm_users/${testUserId}`);

	// 2) Seed a few orders for the test user
	const ordersToCreate = [
		{
			userId: testUserId,
			service: { id: 'cleaning', name: 'Dọn dẹp nhà cửa', icon: '🧹' },
			schedule: { date: '2025-09-01', time: '09:00', duration: 2, frequency: 'one-time' },
			contact: { name: 'Test Customer', phone: '0900000001', email: 'test-customer@example.com', address: '123 Đường A, Quận B', notes: 'Dọn sạch ban công' },
			payment: { amount: 220000, method: 'vnpay', currency: 'VND' },
			status: 'pending_confirmation',
			statusHistory: [
				{ status: 'pending_payment', timestamp: now, note: 'Đơn hàng được tạo, chờ thanh toán' },
				{ status: 'pending_confirmation', timestamp: now, note: 'Thanh toán thành công, chờ xác nhận' }
			],
			createdAt: now,
			updatedAt: now
		},
		{
			userId: testUserId,
			service: { id: 'deep-cleaning', name: 'Tổng vệ sinh', icon: '✨' },
			schedule: { date: '2025-09-03', time: '14:00', duration: 4, frequency: 'one-time' },
			contact: { name: 'Test Customer', phone: '0900000001', email: 'test-customer@example.com', address: '456 Đường C, Quận D', notes: '' },
			payment: { amount: 660000, method: 'vnpay', currency: 'VND' },
			status: 'confirmed',
			statusHistory: [
				{ status: 'pending_payment', timestamp: now, note: 'Đơn hàng được tạo' },
				{ status: 'pending_confirmation', timestamp: now, note: 'Thanh toán thành công' },
				{ status: 'confirmed', timestamp: now, note: 'Đã xác nhận, chuẩn bị nhân viên' }
			],
			createdAt: now,
			updatedAt: now
		},
		{
			userId: testUserId,
			service: { id: 'airconditioner-cleaning', name: 'Vệ sinh máy lạnh', icon: '❄️' },
			schedule: { date: '2025-08-25', time: '10:30', duration: 2, frequency: 'one-time' },
			contact: { name: 'Test Customer', phone: '0900000001', email: 'test-customer@example.com', address: '789 Đường E, Quận F', notes: '2 dàn lạnh' },
			payment: { amount: 250000, method: 'vnpay', currency: 'VND', vnpayTransactionId: 'TEST123456', vnpayBankCode: 'NCB', paidAt: now },
			status: 'completed',
			statusHistory: [
				{ status: 'pending_payment', timestamp: now, note: 'Đơn hàng được tạo' },
				{ status: 'pending_confirmation', timestamp: now, note: 'Thanh toán thành công' },
				{ status: 'confirmed', timestamp: now, note: 'Đã xác nhận' },
				{ status: 'in_progress', timestamp: now, note: 'Nhân viên đang thực hiện' },
				{ status: 'completed', timestamp: now, note: 'Hoàn thành dịch vụ' }
			],
			createdAt: now,
			updatedAt: now
		}
	];

	const createdIds = [];
	for (const order of ordersToCreate) {
		const ref = await db.collection('orders').add(order);
		createdIds.push(ref.id);
	}
	console.log(`✔ Seeded ${createdIds.length} orders:`, createdIds.map(id => id.slice(-8)).join(', '));

	// 3) Read back a few records to verify
	const snapshot = await db.collection('orders')
		.where('userId', '==', testUserId)
		.limit(5)
		.get();

	console.log(`📄 Read back ${snapshot.size} order(s) for user ${testUserId}`);
	snapshot.forEach(doc => {
		const data = doc.data();
		console.log(`- ${doc.id}: ${data.service?.name} | ${data.status} | ${data.payment?.amount} VND`);
	});

	console.log('✅ Seeding completed.');
}

seed()
	.then(() => process.exit(0))
	.catch(err => {
		console.error('❌ Seed failed:', err);
		process.exit(1);
	});


