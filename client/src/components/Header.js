import { Import } from "lucide-react";
import { useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="shadow-sm bg-white">
      <Container>
        <Navbar expand="lg" className="py-0">
          {/* Logo và tên thương hiệu */}
          <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
            <img
              src="/logo.png"
              alt="MyMaid"
              style={{ width: 30, height: 30 }}
            />
            <span>MyMaid</span>
          </Navbar.Brand>

          <Nav className="mx-auto gap-5 align-items-center">
            <Nav.Link as={Link} to="/about-us" id="nav-about">Về MyMaid</Nav.Link>
            <Nav.Link as={Link} to="/blog">Mẹo Vặt hay</Nav.Link>
            <Nav.Link as={Link} to="/partner">Trở thành đối tác</Nav.Link>
            <Nav.Link as={Link} to="/login">Đăng Nhập</Nav.Link>
          </Nav>

        </Navbar>
      </Container>
    </div>
  );
}
