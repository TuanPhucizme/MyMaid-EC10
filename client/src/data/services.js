export const services = [
  {
    id: 1,
    name: "Dọn Dẹp Nhà Cửa",
    subtitle: "Theo giờ",
    description: "Dịch vụ dọn dẹp nhà cửa chuyên nghiệp, linh hoạt theo nhu cầu",
    price: "80,000",
    unit: "giờ",
    duration: "2-4 giờ",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
    features: [
      "Quét, lau nhà",
      "Dọn dẹp phòng khách, phòng ngủ",
      "Vệ sinh nhà bếp",
      "Dọn dẹp nhà tắm"
    ],
    popular: true,
    rating: 4.8,
    bookings: 1250,
    serviceType: "cleaning",
    pricing: {
      basePrice: 80000,
      unit: "giờ",
      minHours: 2,
      maxHours: 8
    },
    cleaningOptions: {
      deepCleaning: {
        name: "Vệ sinh sâu",
        description: "Làm sạch kỹ lưỡng các góc khuất",
        price: 20000,
        icon: "✨"
      },
      windowCleaning: {
        name: "Lau kính cửa sổ",
        description: "Vệ sinh kính cửa sổ, ban công",
        price: 15000,
        icon: "🪟"
      },
      applianceCleaning: {
        name: "Vệ sinh thiết bị",
        description: "Lau chùi tủ lạnh, lò vi sóng",
        price: 25000,
        icon: "🔌"
      }
    },
    areaOptions: [
      { id: "small", name: "Nhỏ (< 50m²)", multiplier: 1 },
      { id: "medium", name: "Vừa (50-80m²)", multiplier: 1.3 },
      { id: "large", name: "Lớn (80-120m²)", multiplier: 1.6 },
      { id: "extra-large", name: "Rất lớn (> 120m²)", multiplier: 2 }
    ]
  },
  {
    id: 2,
    name: "Dọn Dẹp Nhà Cửa",
    subtitle: "Gói tháng",
    description: "Gói dịch vụ dọn dẹp định kỳ hàng tháng với giá ưu đãi",
    price: "1,200,000",
    unit: "tháng",
    duration: "8 lần/tháng",
    icon: "📅",
    image: "https://media.gettyimages.com/id/1417833124/photo/professional-cleaner-cleaning-a-table-at-a-house.jpg?s=2048x2048&w=gi&k=20&c=SmRzdfXzybOYcYytzD2i_am_RfwykpAlgDY44Pbx57Q=",
    features: [
      "2 lần/tuần",
      "Dọn dẹp toàn bộ nhà",
      "Giặt ủi cơ bản",
      "Hỗ trợ 24/7"
    ],
    popular: false,
    rating: 4.9,
    bookings: 890,
    discount: 20
  },
  {
    id: 3,
    name: "Tổng Vệ Sinh",
    subtitle: "Deep cleaning",
    description: "Vệ sinh tổng thể, làm sạch sâu mọi ngóc ngách trong nhà",
    price: "300,000",
    unit: "lần",
    duration: "4-6 giờ",
    icon: "✨",
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400",
    features: [
      "Vệ sinh sâu tất cả phòng",
      "Lau kính, cửa sổ",
      "Vệ sinh thiết bị điện",
      "Khử trùng toàn bộ"
    ],
    popular: false,
    rating: 4.7,
    bookings: 650
  },
  {
    id: 4,
    name: "Dịch Vụ Chuyển Nhà",
    subtitle: "Đóng gói & vận chuyển",
    description: "Hỗ trợ đóng gói, dọn dẹp và sắp xếp khi chuyển nhà",
    price: "500,000",
    unit: "lần",
    duration: "1 ngày",
    icon: "📦",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
    features: [
      "Đóng gói đồ đạc",
      "Dọn dẹp nhà cũ",
      "Sắp xếp nhà mới",
      "Vận chuyển nhỏ"
    ],
    popular: false,
    rating: 4.6,
    bookings: 320,
    isNew: true
  },
  {
    id: 5,
    name: "Vệ Sinh Máy Lạnh",
    subtitle: "Chuyên nghiệp",
    description: "Vệ sinh máy lạnh chuyên nghiệp, tăng hiệu suất làm mát",
    price: "150,000",
    unit: "máy",
    duration: "1-2 giờ",
    icon: "❄️",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
    features: [
      "Vệ sinh dàn lạnh",
      "Vệ sinh dàn nóng",
      "Kiểm tra gas",
      "Bảo dưỡng tổng thể"
    ],
    popular: false,
    rating: 4.8,
    bookings: 750
  },
  {
    id: 6,
    name: "Vệ Sinh Sofa & Thảm",
    subtitle: "Giặt khô chuyên nghiệp",
    description: "Vệ sinh sofa, thảm, rèm cửa bằng công nghệ hiện đại",
    price: "200,000",
    unit: "bộ",
    duration: "2-3 giờ",
    icon: "🛋️",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    features: [
      "Giặt khô chuyên nghiệp",
      "Khử mùi, diệt khuẩn",
      "Làm mới màu sắc",
      "Bảo vệ chất liệu"
    ],
    popular: false,
    rating: 4.7,
    bookings: 450
  },
  {
    id: 7,
    name: "Giặt Ủi Quần Áo",
    subtitle: "Pickup & delivery",
    description: "Dịch vụ giặt ủi tại nhà với pickup và giao hàng miễn phí",
    price: "25,000",
    unit: "kg",
    duration: "24-48h",
    icon: "👕",
    image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400",
    features: [
      "Nhận và giao tại nhà",
      "Giặt theo chất liệu",
      "Ủi phẳng, thơm tho",
      "Đóng gói cẩn thận"
    ],
    popular: true,
    rating: 4.9,
    bookings: 2100,
    serviceType: "laundry",
    pricing: {
      basePrice: 25000,
      unit: "kg",
      minWeight: 2,
      maxWeight: 20,
      priceBreaks: [
        { from: 2, to: 5, price: 25000 },
        { from: 6, to: 10, price: 23000 },
        { from: 11, to: 20, price: 20000 }
      ]
    },
    laundryOptions: {
      separateWash: {
        name: "Giặt riêng",
        description: "Giặt riêng biệt với đồ khác",
        price: 10000,
        icon: "🔄"
      },
      childrenClothes: {
        name: "Đồ trẻ em",
        description: "Chế độ giặt đặc biệt cho đồ trẻ em",
        price: 5000,
        icon: "👶"
      },
      delicateItems: {
        name: "Đồ delicat",
        description: "Giặt nhẹ nhàng cho đồ mỏng manh",
        price: 8000,
        icon: "🌸"
      },
      expressService: {
        name: "Dịch vụ nhanh",
        description: "Hoàn thành trong 12-24h",
        price: 15000,
        icon: "⚡"
      },
      premiumDetergent: {
        name: "Nước giặt cao cấp",
        description: "Sử dụng nước giặt thương hiệu cao cấp",
        price: 12000,
        icon: "✨"
      },
      antiAllergy: {
        name: "Chống dị ứng",
        description: "Nước giặt không gây dị ứng",
        price: 8000,
        icon: "🛡️"
      }
    },
    clothingTypes: [
      { id: "casual", name: "Quần áo thường ngày", icon: "👕" },
      { id: "formal", name: "Quần áo công sở", icon: "👔" },
      { id: "sportswear", name: "Đồ thể thao", icon: "🏃" },
      { id: "underwear", name: "Đồ lót", icon: "🩲" },
      { id: "bedding", name: "Chăn ga gối", icon: "🛏️" },
      { id: "curtains", name: "Rèm cửa", icon: "🪟" },
      { id: "towels", name: "Khăn tắm", icon: "🏖️" },
      { id: "baby", name: "Đồ em bé", icon: "👶" }
    ]
  },
  {
    id: 8,
    name: "Chăm Sóc Trẻ Em",
    subtitle: "Babysitting",
    description: "Dịch vụ chăm sóc trẻ em chuyên nghiệp, an toàn",
    price: "100,000",
    unit: "giờ",
    duration: "Linh hoạt",
    icon: "👶",
    image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400",
    features: [
      "Chăm sóc trẻ tại nhà",
      "Hỗ trợ học tập",
      "Nấu ăn cho trẻ",
      "Giám sát an toàn"
    ],
    popular: false,
    rating: 4.9,
    bookings: 680
  }
];

export const serviceCategories = [
  {
    id: 1,
    name: "Dọn Dẹp Nhà Cửa",
    icon: "🏠",
    count: 3,
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: 2,
    name: "Vệ Sinh Chuyên Sâu",
    icon: "✨",
    count: 3,
    color: "bg-green-100 text-green-600"
  },
  {
    id: 3,
    name: "Giặt Ủi",
    icon: "👕",
    count: 1,
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: 4,
    name: "Chăm Sóc",
    icon: "👶",
    count: 1,
    color: "bg-pink-100 text-pink-600"
  }
];