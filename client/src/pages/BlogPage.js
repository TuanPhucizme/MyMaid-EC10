import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const blogPosts = [
  {
    title: "5 mẹo đơn giản để giữ nhà luôn thơm mát",
    summary: "Khám phá các bí quyết tự nhiên giúp không gian sống của bạn luôn dễ chịu.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  },
  {
    title: "Cách tẩy vết ố lâu ngày trong nhà tắm",
    summary: "Những nguyên liệu dễ kiếm và hiệu quả bất ngờ giúp làm sạch nhà tắm sáng bóng.",
    image: "https://images.unsplash.com/photo-1572742482459-e04d6cfdd6f3",
  
  },
  {
    title: "Bí quyết giặt chăn ga sạch như mới",
    summary: "Bạn có biết cách giặt mà vẫn giữ được màu sắc và độ mềm mại của chăn ga?",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
  },
  {
    title: "Bí quyết giặt chăn ga sạch như mới",
    summary: "Bạn có biết cách giặt mà vẫn giữ được màu sắc và độ mềm mại của chăn ga?",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
  },
  {
    title: "Bí quyết giặt chăn ga sạch như mới",
    summary: "Bạn có biết cách giặt mà vẫn giữ được màu sắc và độ mềm mại của chăn ga?",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
  },
  {
    title: "Bí quyết giặt chăn ga sạch như mới",
    summary: "Bạn có biết cách giặt mà vẫn giữ được màu sắc và độ mềm mại của chăn ga?",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
  },
];

export default function BlogPage() {
  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">Mẹo Vặt Dọn Dẹp Nhà</h2>
      <Row>
        {blogPosts.map((post, index) => (
          <Col md={4} key={index} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src={post.image} alt={post.title} />
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.summary}</Card.Text>
                <a href="#" className="btn btn-primary btn-sm">
                  Xem chi tiết
                </a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
