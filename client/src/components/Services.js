import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const services = [
  { name: "Dọn Dẹp Nhà", sub: "Ca Lẻ" },
  { name: "Dọn Dẹp Nhà", sub: "Gói Tháng" },
  { name: "Tổng vệ sinh" },
  { name: "Dịch vụ chuyển nhà", isNew: true},
  { name: "Vệ sinh máy lạnh" },
  { name: "Vệ sinh Sofa - Đệm - Rèm" },
  { name: "Giặt Đồ" },
];

export default function Services() {
  return (
    <Container>
      <h5 className="mb-3">Dịch vụ</h5>
      <Row>
        {services.map((service, index) => (
          <Col xs={6} md={3} className="mb-4" key={index}>
            <Card className="text-center border-0 shadow-sm rounded-4">
              <Card.Body>
                <Card.Title className="h6">{service.name}</Card.Title>
                {service.sub && <p className="text-muted">{service.sub}</p>}
                {service.isNew && <span className="badge bg-danger">NEW</span>}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
