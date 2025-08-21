import { Home, Calendar, Package, Shirt, Baby, Sparkles } from "lucide-react";

export const services = [
  {
    id: 1,
    name: "Dọn Dẹp Nhà Cửa",
    subtitle: "Theo giờ",
    description: "Dịch vụ dọn dẹp nhà cửa chuyên nghiệp, linh hoạt theo nhu cầu",
    price: 80000, // Đã chuyển đổi sang số nguyên
    unit: "giờ",
    duration: "2-4 giờ",
    icon: <Home className="w-6 h-6 text-blue-500" />,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
    features: [
      "Quét, lau nhà",
      "Dọn dẹp phòng khách, phòng ngủ",
      "Vệ sinh nhà bếp",
      "Dọn dẹp nhà tắm"
    ],
    popular: true,
    rating: 4.8,
    bookings: 1250
  },
  {
    id: 2,
    name: "Dọn Dẹp Nhà Cửa",
    subtitle: "Gói tháng",
    description: "Gói dịch vụ dọn dẹp định kỳ hàng tháng với giá ưu đãi",
    price: 1200000, // Đã chuyển đổi sang số nguyên
    unit: "tháng",
    duration: "",
    icon: <Calendar className="w-6 h-6 text-indigo-500" />,
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
    name: "Dịch Vụ Chuyển Nhà",
    subtitle: "Đóng gói & vận chuyển",
    description: "Hỗ trợ đóng gói, dọn dẹp và sắp xếp khi chuyển nhà",
    price: 500000, // Đã chuyển đổi sang số nguyên
    unit: "lần",
    duration: "1 ngày",
    icon: <Package className="w-6 h-6 text-green-500" />,
    image: "https://images.unsplash.com/photo-1614359835514-92f8ba196357?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    id: 4,
    name: "Giặt Ủi Quần Áo",
    subtitle: "Nhận & Giao Tận Nơi",
    description: "Nhân viên đến nhà nhận quần áo cần giặt, xử lý tại cơ sở chuyên nghiệp và giao trả tận nơi.",
    price: 25000, // Đã chuyển đổi sang số nguyên
    unit: "kg",
    duration: "24-48h",
    icon: <Shirt className="w-6 h-6 text-purple-500" />,
    image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400",
    features: [
      "Giặt sấy tại cơ sở chuyên nghiệp",
      "Ủi thẳng, thơm tho sạch sẽ",
      "Giao trả tận nơi miễn phí"
    ],
    popular: true,
    rating: 4.9,
    bookings: 2100
  },
  {
    id: 5,
    name: "Chăm Sóc Trẻ Em",
    subtitle: "Babysitting",
    description: "Dịch vụ chăm sóc trẻ em chuyên nghiệp, an toàn",
    price: 100000, // Đã chuyển đổi sang số nguyên
    unit: "giờ",
    duration: "Linh hoạt",
    icon: <Baby className="w-6 h-6 text-pink-500" />,
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
    icon: <Home className="w-5 h-5" />,
    count: 2, // Đã cập nhật: Có 2 dịch vụ dọn dẹp nhà cửa trong mảng `services`
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: 2,
    name: "Vệ Sinh Chuyên Sâu",
    icon: <Sparkles className="w-5 h-5" />,
    count: 0, // Đã cập nhật: Hiện không có dịch vụ nào với icon Sparkles trong mảng `services`
    color: "bg-green-100 text-green-600"
  },
  {
    id: 3,
    name: "Giặt Ủi",
    icon: <Shirt className="w-5 h-5" />,
    count: 1,
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: 4,
    name: "Chăm Sóc",
    icon: <Baby className="w-5 h-5" />,
    count: 1,
    color: "bg-pink-100 text-pink-600"
  }
];