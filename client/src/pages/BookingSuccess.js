import React from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function BookingSuccess() {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  const handleViewOrder = () => {
    navigate("/orders"); // Thay đổi nếu URL khác
  };

  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={6}>
          <Image
            src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
            alt="Success"
            fluid
            width={120}
            className="mb-4"
          />
          <h2 className="mb-3 text-success">Đặt Lịch Thành Công!</h2>
          <p className="lead">
            Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của <strong>MyMaid</strong>. Chúng tôi sẽ sớm liên hệ để xác nhận thông tin và tiến hành dịch vụ đúng thời gian bạn đã chọn.
          </p>
          <div className="mt-4 d-flex justify-content-center gap-3">
            <Button variant="primary" onClick={handleBackHome}>
              Về trang chủ
            </Button>
            <Button variant="outline-success" onClick={handleViewOrder}>
              Xem đơn đặt lịch
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

// sau sẽ gắn BE mã dịch vụ và thời gian dự kiến dịch vụ
