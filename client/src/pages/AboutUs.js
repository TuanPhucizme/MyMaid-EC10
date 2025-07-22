import React from "react";
import { Container, Row, Col, Image, ListGroup } from "react-bootstrap";

export default function AboutUs() {
  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">Về MyMaid</h2>
      <Row className="align-items-center mb-5">
        <Col md={6}>
          <p>
            <strong>MyMaid</strong> là dịch vụ dọn dẹp nhà chuyên nghiệp, uy tín
            và tiện lợi tại Việt Nam. Chúng tôi mang đến giải pháp giúp gia đình
            bạn luôn sạch sẽ, thoải mái mà không mất nhiều thời gian.
          </p>
          <p>
            Dịch vụ của chúng tôi bao gồm dọn dẹp định kỳ, tổng vệ sinh, vệ sinh
            sofa, máy lạnh, chuyển nhà và nhiều tiện ích khác. Đội ngũ nhân viên
            thân thiện, được đào tạo kỹ lưỡng, mang đến trải nghiệm hài lòng
            tuyệt đối.
          </p>
          <p>
            Hãy để <strong>MyMaid</strong> đồng hành cùng bạn trong hành trình xây dựng
            không gian sống sạch sẽ và ngăn nắp!
          </p>
        </Col>
        <Col md={6}>
          <Image
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
            fluid
            rounded
            alt="MyMaid Service"
          />
        </Col>
      </Row>

      <h2 className="mb-4 text-center">Quy Trình Thực Hiện Dịch Vụ</h2>
      <Row>
        <Col md={6}>
          <h5>✅ Dọn dẹp sơ bộ</h5>
          <ListGroup variant="flush" className="mb-3">
            <ListGroup.Item>Quét dọn, thu gom rác và phân loại đúng nơi quy định.</ListGroup.Item>
            <ListGroup.Item>Tạo mặt bằng sạch sẽ để sẵn sàng cho quá trình vệ sinh chi tiết.</ListGroup.Item>
          </ListGroup>

          <h5>✅ Vệ sinh trần nhà</h5>
          <ListGroup variant="flush" className="mb-3">
            <ListGroup.Item>Quét sạch bụi bẩn, mạng nhện.</ListGroup.Item>
            <ListGroup.Item>Lau chùi quanh đèn, quạt trần, máng đèn một cách cẩn thận.</ListGroup.Item>
          </ListGroup>

          <h5>✅ Vệ sinh tường & cửa</h5>
          <ListGroup variant="flush" className="mb-3">
            <ListGroup.Item>Làm sạch tường, chân tường, đặc biệt những vết bẩn bám lâu ngày.</ListGroup.Item>
            <ListGroup.Item>Vệ sinh cửa gỗ, cửa kính, cửa sổ trong và ngoài.</ListGroup.Item>
          </ListGroup>

          <h5>✅ Vệ sinh cầu thang bộ</h5>
          <ListGroup variant="flush" className="mb-3">
            <ListGroup.Item>Lau sạch từng bậc thang, tay vịn và thiết bị phòng cháy chữa cháy.</ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={6}>
          <h5>✅ Vệ sinh nhà vệ sinh (Toilet)</h5>
          <ListGroup variant="flush" className="mb-3">
            <ListGroup.Item>Xịt và xử lý hóa chất khử khuẩn, đánh sạch bồn cầu, lavabo, gương và vòi nước.</ListGroup.Item>
            <ListGroup.Item>Làm sạch tường, vách ngăn, khử mùi toàn diện.</ListGroup.Item>
            <ListGroup.Item>Toilet thơm mát, sáng bóng sau khi hoàn tất.</ListGroup.Item>
          </ListGroup>

          <h5>✅ Vệ sinh nhà bếp</h5>
          <ListGroup variant="flush" className="mb-3">
            <ListGroup.Item>Dọn rác, sắp xếp lại đồ đạc cho gọn gàng, khoa học.</ListGroup.Item>
            <ListGroup.Item>
              Tẩy dầu mỡ ở bếp gas, bồn rửa, lò vi sóng, nồi cơm điện, ống thoát nước,...
            </ListGroup.Item>
            <ListGroup.Item>Làm sạch và khử trùng toàn diện tủ bếp và thiết bị nấu ăn.</ListGroup.Item>
          </ListGroup>

          <h5>🔹 Nghiệm Thu Minh Bạch</h5>
          <p>
            Khách hàng trực tiếp kiểm tra từng khu vực đã vệ sinh. Nếu chưa hài lòng, MyMaid sẵn sàng làm lại ngay — hoàn toàn không tính phí.
          </p>

          <h5>🔹 Hoàn Tất & Thanh Toán</h5>
          <p>
            Chỉ khi khách hàng hoàn toàn hài lòng, chúng tôi mới tiến hành thanh toán và kết thúc hợp đồng. Sự hài lòng của bạn là ưu tiên hàng đầu!
          </p>
        </Col>
      </Row>
    </Container>
  );
}
