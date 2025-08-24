const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { db } = require('../config/firebaseAdmin');

async function seed() {
	console.log('🌱 Seeding Firestore with MyMaid-EC10 data...');

	const testUserId = process.env.SEED_USER_ID || 'test-user-uid';
	const now = new Date();

	// 1) Tạo dữ liệu người dùng mẫu
	const userDocRef = db.collection('mm_users').doc(testUserId);
	await userDocRef.set({
		name: 'Nguyễn Văn A',
		email: 'nguyenvana@example.com',
		phone: '0901234567',
		role: 'customer',
		status: 'active',
		address: {
			street: '123 Đường Nguyễn Huệ',
			ward: 'Phường Bến Nghé',
			district: 'Quận 1',
			city: 'TP. Hồ Chí Minh',
			fullAddress: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
		},
		preferences: {
			notifications: true,
			language: 'vi',
			currency: 'VND'
		},
		createdAt: now,
		updatedAt: now
	}, { merge: true });
	console.log(`✔ Created/updated user profile mm_users/${testUserId}`);

	// 2) Tạo dữ liệu dịch vụ
	const services = [
		{
			id: 'house-cleaning',
			name: 'Dọn dẹp nhà cửa',
			icon: '🧹',
			description: 'Dịch vụ dọn dẹp nhà cửa chuyên nghiệp',
			category: 'cleaning',
			pricing: {
				basePrice: 150000,
				pricePerHour: 75000,
				currency: 'VND'
			},
			duration: { min: 2, max: 8, default: 3 },
			isActive: true,
			features: ['Lau dọn toàn bộ nhà', 'Hút bụi', 'Lau kính', 'Sắp xếp đồ đạc'],
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'deep-cleaning',
			name: 'Tổng vệ sinh',
			icon: '✨',
			description: 'Dịch vụ tổng vệ sinh sâu toàn bộ ngôi nhà',
			category: 'cleaning',
			pricing: {
				basePrice: 300000,
				pricePerHour: 100000,
				currency: 'VND'
			},
			duration: { min: 4, max: 12, default: 6 },
			isActive: true,
			features: ['Vệ sinh sâu mọi ngóc ngách', 'Khử trùng', 'Làm sạch thiết bị', 'Tổ chức không gian'],
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'ac-cleaning',
			name: 'Vệ sinh máy lạnh',
			icon: '❄️',
			description: 'Dịch vụ vệ sinh máy lạnh chuyên nghiệp',
			category: 'maintenance',
			pricing: {
				basePrice: 200000,
				pricePerUnit: 150000,
				currency: 'VND'
			},
			duration: { min: 1, max: 4, default: 2 },
			isActive: true,
			features: ['Vệ sinh dàn lạnh', 'Thay lọc gió', 'Kiểm tra gas', 'Bảo dưỡng định kỳ'],
			createdAt: now,
			updatedAt: now
		}
	];

	// Lưu services vào Firestore
	for (const service of services) {
		await db.collection('services').doc(service.id).set(service);
	}
	console.log(`✔ Created ${services.length} services`);

	// 3) Tạo dữ liệu đơn hàng mẫu
	const ordersToCreate = [
		{
			userId: testUserId,
			orderNumber: 'MM' + Date.now().toString().slice(-6),
			service: {
				id: 'house-cleaning',
				name: 'Dọn dẹp nhà cửa',
				icon: '🧹',
				pricing: { basePrice: 150000, pricePerHour: 75000 }
			},
			schedule: {
				date: '2025-09-01',
				time: '09:00',
				duration: 3,
				frequency: 'one-time',
				notes: 'Dọn sạch ban công và phòng khách'
			},
			contact: {
				name: 'Nguyễn Văn A',
				phone: '0901234567',
				email: 'nguyenvana@example.com',
				address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
			},
			payment: {
				amount: 375000,
				method: 'vnpay',
				currency: 'VND',
				breakdown: {
					basePrice: 150000,
					hourlyRate: 75000,
					hours: 3,
					subtotal: 375000,
					discount: 0,
					total: 375000
				}
			},
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
			orderNumber: 'MM' + (Date.now() + 1000).toString().slice(-6),
			service: {
				id: 'deep-cleaning',
				name: 'Tổng vệ sinh',
				icon: '✨',
				pricing: { basePrice: 300000, pricePerHour: 100000 }
			},
			schedule: {
				date: '2025-09-03',
				time: '14:00',
				duration: 6,
				frequency: 'one-time',
				notes: 'Tổng vệ sinh toàn bộ căn hộ'
			},
			contact: {
				name: 'Nguyễn Văn A',
				phone: '0901234567',
				email: 'nguyenvana@example.com',
				address: '456 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh'
			},
			payment: {
				amount: 900000,
				method: 'vnpay',
				currency: 'VND',
				breakdown: {
					basePrice: 300000,
					hourlyRate: 100000,
					hours: 6,
					subtotal: 900000,
					discount: 0,
					total: 900000
				}
			},
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
			orderNumber: 'MM' + (Date.now() + 2000).toString().slice(-6),
			service: {
				id: 'ac-cleaning',
				name: 'Vệ sinh máy lạnh',
				icon: '❄️',
				pricing: { basePrice: 200000, pricePerUnit: 150000 }
			},
			schedule: {
				date: '2025-08-25',
				time: '10:30',
				duration: 2,
				frequency: 'one-time',
				notes: '2 dàn lạnh trong phòng ngủ và phòng khách'
			},
			contact: {
				name: 'Nguyễn Văn A',
				phone: '0901234567',
				email: 'nguyenvana@example.com',
				address: '789 Đường Pasteur, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh'
			},
			payment: {
				amount: 500000,
				method: 'vnpay',
				currency: 'VND',
				vnpayTransactionId: 'TEST123456',
				vnpayBankCode: 'NCB',
				paidAt: now,
				breakdown: {
					basePrice: 200000,
					unitPrice: 150000,
					units: 2,
					subtotal: 500000,
					discount: 0,
					total: 500000
				}
			},
			status: 'completed',
			statusHistory: [
				{ status: 'pending_payment', timestamp: now, note: 'Đơn hàng được tạo' },
				{ status: 'pending_confirmation', timestamp: now, note: 'Thanh toán thành công' },
				{ status: 'confirmed', timestamp: now, note: 'Đã xác nhận' },
				{ status: 'in_progress', timestamp: now, note: 'Nhân viên đang thực hiện' },
				{ status: 'completed', timestamp: now, note: 'Hoàn thành dịch vụ' }
			],
			rating: {
				score: 5,
				comment: 'Dịch vụ rất tốt, nhân viên chuyên nghiệp',
				createdAt: now
			},
			createdAt: now,
			updatedAt: now
		}
	];

	// Lưu orders vào Firestore
	const createdIds = [];
	for (const order of ordersToCreate) {
		const ref = await db.collection('orders').add(order);
		createdIds.push(ref.id);
	}
	console.log(`✔ Created ${createdIds.length} orders:`, createdIds.map(id => id.slice(-8)).join(', '));

	// 4) Tạo dữ liệu nhân viên mẫu
	const staff = [
		{
			id: 'staff-001',
			name: 'Trần Thị B',
			email: 'tranthib@mymaid.com',
			phone: '0912345678',
			role: 'staff',
			status: 'active',
			specialties: ['house-cleaning', 'deep-cleaning'],
			rating: 4.8,
			completedOrders: 156,
			avatar: 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=TTB',
			address: {
				district: 'Quận 1',
				city: 'TP. Hồ Chí Minh'
			},
			availability: {
				monday: { start: '08:00', end: '18:00' },
				tuesday: { start: '08:00', end: '18:00' },
				wednesday: { start: '08:00', end: '18:00' },
				thursday: { start: '08:00', end: '18:00' },
				friday: { start: '08:00', end: '18:00' },
				saturday: { start: '09:00', end: '17:00' },
				sunday: { start: '09:00', end: '15:00' }
			},
			createdAt: now,
			updatedAt: now
		},
		{
			id: 'staff-002',
			name: 'Lê Văn C',
			email: 'levanc@mymaid.com',
			phone: '0923456789',
			role: 'staff',
			status: 'active',
			specialties: ['ac-cleaning', 'maintenance'],
			rating: 4.9,
			completedOrders: 89,
			avatar: 'https://via.placeholder.com/150/2196F3/FFFFFF?text=LVC',
			address: {
				district: 'Quận 3',
				city: 'TP. Hồ Chí Minh'
			},
			availability: {
				monday: { start: '07:00', end: '17:00' },
				tuesday: { start: '07:00', end: '17:00' },
				wednesday: { start: '07:00', end: '17:00' },
				thursday: { start: '07:00', end: '17:00' },
				friday: { start: '07:00', end: '17:00' },
				saturday: { start: '08:00', end: '16:00' },
				sunday: 'off'
			},
			createdAt: now,
			updatedAt: now
		}
	];

	// Lưu staff vào Firestore
	for (const member of staff) {
		await db.collection('mm_users').doc(member.id).set(member);
	}
	console.log(`✔ Created ${staff.length} staff members`);

	// 5) Tạo dữ liệu cấu hình hệ thống
	const systemConfig = {
		app: {
			name: 'MyMaid',
			version: '1.0.0',
			supportEmail: 'support@mymaid.com',
			supportPhone: '1900-MYMAID'
		},
		pricing: {
			currency: 'VND',
			taxRate: 0.1,
			serviceFee: 0.05
		},
		features: {
			onlinePayment: true,
			scheduling: true,
			rating: true,
			chat: true
		},
		updatedAt: now
	};

	await db.collection('system').doc('config').set(systemConfig);
	console.log('✔ Created system configuration');

	// 6) Đọc lại dữ liệu để xác minh
	const orderSnapshot = await db.collection('orders')
		.where('userId', '==', testUserId)
		.limit(5)
		.get();

	console.log(`📄 Verified ${orderSnapshot.size} order(s) for user ${testUserId}`);
	orderSnapshot.forEach(doc => {
		const data = doc.data();
		console.log(`- ${doc.id}: ${data.service?.name} | ${data.status} | ${data.payment?.amount?.toLocaleString()} VND`);
	});

	const serviceSnapshot = await db.collection('services').get();
	console.log(`📄 Verified ${serviceSnapshot.size} service(s)`);

	console.log('✅ MyMaid-EC10 Firestore seeding completed successfully!');
}

seed()
	.then(() => process.exit(0))
	.catch(err => {
		console.error('❌ Seed failed:', err);
		process.exit(1);
	});


