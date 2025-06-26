import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";

export default function AboutUs() {
  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">Về MyMaid</h2>
      <Row className="align-items-center">
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
    </Container>
  );
}
