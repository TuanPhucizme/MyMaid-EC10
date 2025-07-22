import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  ListGroup,
  Alert,
} from "react-bootstrap";

export default function CheckoutPage() {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập thanh toán thành công
    setPaymentSuccess(true);
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">Thanh Toán Dịch Vụ</h2>
      <Row>
        <Col md={7}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Thông Tin Khách Hàng</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control type="text" placeholder="Nguyễn Văn A" required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control type="tel" placeholder="0123 456 789" required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control type="text" placeholder="123 Đường ABC, Quận 1" required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ghi chú</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Ví dụ: Dọn tầng 2 trước" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phương Thức Thanh Toán</Form.Label>
                  <Form.Select required>
                    <option value="">-- Chọn phương thức --</option>
                    <option>Chuyển khoản ngân hàng</option>
                    <option>Thanh toán khi hoàn tất</option>
                    <option>Ví điện tử (Momo, ZaloPay...)</option>
                  </Form.Select>
                </Form.Group>

                <Button variant="success" type="submit" className="w-100">
                  Xác Nhận Thanh Toán
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {paymentSuccess && (
            <Alert variant="success" className="text-center">
              ✅ Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ của <strong>MyMaid</strong>.
            </Alert>
          )}
        </Col>

        <Col md={5}>
          <Card>
            <Card.Header>Chi Tiết Dịch Vụ</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>Dịch vụ: Tổng vệ sinh nhà cửa</ListGroup.Item>
              <ListGroup.Item>Ngày đặt: 25/07/2025</ListGroup.Item>
              <ListGroup.Item>Thời gian: 08:00 - 11:00</ListGroup.Item>
              <ListGroup.Item>Số lượng nhân viên: 2</ListGroup.Item>
              <ListGroup.Item>Giá dịch vụ: <strong>500.000 VND</strong></ListGroup.Item>
            </ListGroup>
            <Card.Footer className="text-end">
              <strong>Tổng cộng: 500.000 VND</strong>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
