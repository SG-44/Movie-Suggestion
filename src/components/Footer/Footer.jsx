import {
  faTwitter,
  faFacebook,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gsap from "gsap";

function Footer() {
  const animate = document.querySelectorAll(".group");

  animate.forEach((element) => {
    element.addEventListener("mouseover", () => {
      gsap.to(element, {
        scale: 1.2,
        duration: 0.3,
      });
    });

    element.addEventListener("mouseout", () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
      });
    });
  });

  return (
    <footer className="h-50 w-full bg-gray-700">
      <p className="text-white text-center p-4">This is the footer</p>
      <div className="flex justify-evenly space-x-4 mt-8">
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <FontAwesomeIcon
            icon={faTwitter}
            className="text-white text-4xl hover:text-blue-500 transition duration-500"
          />
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <FontAwesomeIcon
            icon={faFacebook}
            className="text-white text-4xl hover:text-blue-600 transition duration-500"
          />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <FontAwesomeIcon
            icon={faInstagram}
            className="text-white text-4xl hover:text-pink-600 transition duration-500"
          />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <FontAwesomeIcon
            icon={faLinkedin}
            className="text-white text-4xl hover:text-blue-600 transition duration-500"
          />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
