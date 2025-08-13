import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CheckSquare, ArrowRight } from 'lucide-react';

// --- Styled Components ---
const BlogContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem 1rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const BlogHeader = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const BlogTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1a202c;
  line-height: 1.2;
  margin-bottom: 0.5rem;
`;

const BlogMeta = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

const FeaturedImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
`;

const BlogContent = styled.div`
  color: #374151;
  line-height: 1.7;
  font-size: 1.125rem;

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a202c;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  p {
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const CTABlock = styled.div`
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 2rem;
  margin-top: 3rem;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const CTASubtitle = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const BlogTetCleaningPage = () => {
  return (
    <BlogContainer>
      <BlogHeader>
        <BlogTitle>Đón Tết Thảnh Thơi: 10 Mẹo Dọn Dẹp Nhà Cửa Nhanh Gọn & Hiệu Quả</BlogTitle>
        <BlogMeta>Đăng bởi MyMaid Admin • Ngày 15 tháng 1, 2025</BlogMeta>
      </BlogHeader>

      <FeaturedImage 
        src="https://vesinhcongnghiep.com/uploads/files/2023/12/19/tranh-ve-don-nha-don-tet.jpg" 
        alt="Dọn dẹp nhà cửa đón Tết" 
      />

      <BlogContent>
        <p>Tết Nguyên Đán đang đến gần, mang theo không khí rộn ràng của mùa sum vầy. Nhưng trước khi tận hưởng những giây phút ấm cúng, một "thử thách" lớn mà mọi gia đình đều phải đối mặt chính là công cuộc tổng vệ sinh nhà cửa. Đừng lo lắng! MyMaid sẽ chia sẻ 10 mẹo cực kỳ hiệu quả để giúp bạn hoàn thành công việc này một cách nhanh chóng và nhẹ nhàng hơn.</p>

        <h3><CheckSquare size={24} color="#3b82f6" /> 1. Lên Kế Hoạch Tác Chiến</h3>
        <p>Đừng lao vào dọn dẹp một cách ngẫu hứng. Hãy dành 15 phút để đi một vòng quanh nhà và lập ra một danh sách công việc chi tiết cho từng phòng. Sắp xếp chúng theo thứ tự ưu tiên: việc khó làm trước, việc dễ làm sau. Một kế hoạch rõ ràng sẽ giúp bạn không bị rối và tiết kiệm đến 30% thời gian.</p>

        <h3><CheckSquare size={24} color="#3b82f6" /> 2. Quy Tắc Vàng: Dọn Đồ Trước, Lau Dọn Sau</h3>
        <p>Nhà cửa sẽ không thể sạch nếu còn quá nhiều đồ đạc bừa bộn. Hãy áp dụng quy tắc "4 thùng": Giữ Lại, Vứt Đi, Cho Tặng, và Sửa Chữa. Việc loại bỏ những vật dụng không cần thiết không chỉ giúp không gian thoáng đãng mà còn làm cho việc lau chùi trở nên dễ dàng hơn rất nhiều.</p>

        <h3><CheckSquare size={24} color="#3b82f6" /> 3. Nguyên Tắc "Từ Trên Xuống Dưới, Từ Trong Ra Ngoài"</h3>
        <p>Đây là nguyên tắc bất di bất dịch trong ngành vệ sinh chuyên nghiệp. Luôn bắt đầu từ những nơi cao nhất (trần nhà, quạt trần, nóc tủ) rồi mới xuống thấp (bàn ghế, sàn nhà). Tương tự, hãy dọn dẹp từ trong các phòng rồi mới ra đến cửa chính. Điều này đảm bảo bụi bẩn sẽ được dọn đi một cách triệt để và không làm bẩn lại khu vực đã lau.</p>

        <h3><CheckSquare size={24} color="#3b82f6" /> 4. Chinh Phục Từng Căn Phòng</h3>
        <p>Thay vì chạy qua lại giữa các phòng, hãy tập trung hoàn thành dứt điểm từng khu vực một. Bắt đầu từ phòng ít sử dụng nhất và kết thúc ở những nơi quan trọng như phòng khách và nhà bếp. Việc "chinh phục" thành công một căn phòng sẽ tạo động lực rất lớn để bạn tiếp tục.</p>

        <h3><CheckSquare size={24} color="#3b82f6" /> 5. "Đánh Bay" Dầu Mỡ Nhà Bếp</h3>
        <p>Nhà bếp là nơi "cứng đầu" nhất. Hãy sử dụng các dung dịch tẩy rửa tự nhiên như giấm trắng pha loãng với nước ấm để lau bề mặt bếp, hoặc baking soda trộn với nước thành hỗn hợp sệt để chà các vết bẩn cứng đầu trên bếp gas và lò vi sóng. Để các dung dịch này "nghỉ" 5-10 phút trước khi lau sẽ mang lại hiệu quả bất ngờ.</p>

        <h3><CheckSquare size={24} color="#3b82f6" /> 6. Làm Sáng Bóng Cửa Kính và Gương</h3>
        <p>Thay vì dùng giấy báo, hãy dùng một chiếc khăn vi sợi (microfiber) và dung dịch lau kính chuyên dụng (hoặc hỗn hợp giấm và nước). Xịt dung dịch lên khăn thay vì xịt trực tiếp lên kính để tránh để lại vệt nước. Lau theo hình ziczac từ trên xuống dưới để có kết quả sáng bóng không tì vết.</p>

        <h3><CheckSquare size={24} color="#3b82f6" /> 7. Đừng Bỏ Quên Bàn Thờ Gia Tiên</h3>
        <p>Đây là khu vực trang trọng nhất. Hãy dùng một chiếc khăn sạch, mềm và chỉ nhúng nước ấm để lau dọn. Tuyệt đối không dùng các chất tẩy rửa hóa học. Sắp xếp lại đồ thờ cúng một cách gọn gàng, trang nghiêm để thể hiện lòng thành kính.</p>

        <h3><CheckSquare size={24} color="#3b82f6" /> 8. Huy Động Sức Mạnh Gia Đình</h3>
        <p>Biến việc dọn dẹp thành một hoạt động gia đình! Phân công công việc rõ ràng cho từng thành viên, từ trẻ nhỏ (dọn dẹp đồ chơi) đến người lớn. Mở một chút nhạc xuân rộn ràng, không khí sẽ trở nên vui vẻ và công việc sẽ được hoàn thành nhanh hơn rất nhiều.</p>

        <h3><CheckSquare size={24} color="#3b82f6" /> 9. Khử Mùi và Tạo Hương Thơm Tự Nhiên</h3>
        <p>Sau khi đã sạch sẽ, hãy làm cho ngôi nhà thêm phần tươi mới. Đặt vỏ cam, quýt hoặc vài nhánh sả, quế vào một nồi nước nhỏ và đun sôi liu riu. Hương thơm tự nhiên sẽ lan tỏa khắp không gian, mang lại cảm giác thư thái và đậm không khí Tết.</p>

        <h3><CheckSquare size={24} color="#3b82f6" /> 10. Hoàn Thiện "Tác Phẩm"</h3>
        <p>Bước cuối cùng là trang hoàng nhà cửa. Cắm một bình hoa tươi, treo vài câu đối đỏ, hoặc bày một khay mứt Tết. Những chi tiết nhỏ này sẽ là điểm nhấn cuối cùng, biến ngôi nhà sạch sẽ của bạn thành một không gian ấm cúng, sẵn sàng chào đón một năm mới an lành và may mắn.</p>

        <CTABlock>
          <CTATitle>Cần một tay giúp sức?</CTATitle>
          <CTASubtitle>Nếu công việc quá bận rộn, hãy để đội ngũ chuyên nghiệp của MyMaid giúp bạn có một cái Tết thảnh thơi và trọn vẹn. Chúng tôi cung cấp các gói dọn dẹp linh hoạt và hiệu quả.</CTASubtitle>
          <CTAButton to="/booking">
            Đặt Dịch Vụ Dọn Dẹp Ngay
            <ArrowRight size={16} />
          </CTAButton>
        </CTABlock>
      </BlogContent>
    </BlogContainer>
  );
};

export default BlogTetCleaningPage;