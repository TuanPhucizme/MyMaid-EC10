import { Carousel } from "react-bootstrap";

export default function Banner() {
  return (
    <div className="banner-wrapper my-2">
      <Carousel indicators={false}>
        <Carousel.Item>
          <img
            className="d-block w-100 banner-img"
            src="https://www.skyweaver.net/images/media/wallpapers/wallpaper1.jpg"
            alt="Banner"
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
