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
    id: 3,
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
    name: "Giặt Ủi",
    icon: "👕",
    count: 1,
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: 3,
    name: "Chăm Sóc",
    icon: "👶",
    count: 1,
    color: "bg-pink-100 text-pink-600"
  }
];