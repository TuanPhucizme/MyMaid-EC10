import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Card, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const pricing = [
  { range: "1 - 4kg", price: "30.000đ" },
  { range: "5 - 10kg", price: "60.000đ" },
  { range: "> 10kg", price: "150.000đ" },
];

export default function LaundryForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    weight: "",
    clothesTypes: [],
    separateWash: false,
    note: "",
  });

  const clothingOptions = [
    "Sơ mi", "Áo thun", "Quần jeans", "Đồ trẻ em", 
    "Đồ lót", "Khăn tắm", "Đồ thể thao"
  ];

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      clothesTypes: checked
        ? [...prev.clothesTypes, value]
        : prev.clothesTypes.filter((item) => item !== value),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Bạn đã gửi yêu cầu giặt đồ thành công!");
    navigate("/checkout");
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">Dịch Vụ Giặt Đồ</h2>
      <Row>
        {/* Form bên trái */}
        <Col md={8}>
          <Card className="p-4 shadow-sm mb-4">
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} md={6}>
                  <Form.Label>Khối lượng (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    placeholder="Ví dụ: 5"
                  />
                </Form.Group>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Loại quần áo</Form.Label>
                <div className="d-flex flex-wrap gap-3">
                  {clothingOptions.map((item) => (
                    <Form.Check
                      key={item}
                      type="checkbox"
                      label={item}
                      value={item}
                      checked={formData.clothesTypes.includes(item)}
                      onChange={handleCheckboxChange}
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Giặt riêng (không giặt chung với đồ khác)"
                  name="separateWash"
                  checked={formData.separateWash}
                  onChange={handleChange}
                />
              </Form.Group>

              {formData.separateWash && (
                <Form.Group className="mb-3">
                  <Form.Label>Ghi chú cho đồ giặt riêng</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="note"
                    placeholder="Ví dụ: Đồ trắng cần giặt nhẹ, áo sơ mi không dùng nước nóng,..."
                    value={formData.note}
                    onChange={handleChange}
                  />
                </Form.Group>
              )}

              <div className="text-end">
                <Button variant="primary" type="submit">
                  Tiếp Theo
                </Button>
              </div>
            </Form>
          </Card>
        </Col>

        {/* Bảng giá bên phải */}
        <Col md={4}>
          <Card className="p-4 shadow-sm">
            <h5 className="mb-3 text-center">Bảng giá giặt đồ</h5>
            <Table striped bordered hover responsive size="sm">
              <thead>
                <tr>
                  <th>Khối lượng</th>
                  <th>Đơn giá</th>
                </tr>
              </thead>
              <tbody>
                {pricing.map((item, index) => (
                  <tr key={index}>
                    <td>{item.range}</td>
                    <td>{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
