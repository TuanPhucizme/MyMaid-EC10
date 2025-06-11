import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

export default function Header() {
  return (
    <div className="shadow-sm bg-white">
      <Container>
        <Navbar expand="lg" className="py-0">
          {/* Logo và tên thương hiệu */}
          <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
            <img
              src="/logo.png" // ← thay bằng logo bạn upload hoặc link
              alt="bTaskee"
              style={{ width: 30, height: 30 }}
            />
            <span className="text-warning fw-bold">bTaskee</span>
          </Navbar.Brand>

          {/* Menu chính */}
          <Nav className="mx-auto gap-3 align-items-center">
            <NavDropdown title="Về bTaskee" id="nav-about" />
            <NavDropdown title="Dịch vụ" id="nav-services" />
            <Nav.Link>bRewards</Nav.Link>
            <Nav.Link>bPay</Nav.Link>
            <Nav.Link>Kinh nghiệm hay</Nav.Link>
          </Nav>

          {/* Góc phải: Ngôn ngữ & Quốc gia */}
          <Nav className="ms-auto align-items-center gap-3">
            <NavDropdown title="Trở thành đối tác" id="nav-partner" />
            <NavDropdown title="🌐 Tiếng Việt" id="nav-language" />
            <NavDropdown
              title={
                <>
                  <img
                    src="https://flagcdn.com/w40/vn.png"
                    alt="VN"
                    style={{ width: 20, marginRight: 6 }}
                  />
                  Việt Nam
                </>
              }
              id="nav-country"
            />
          </Nav>
        </Navbar>
      </Container>
    </div>
  );
}
