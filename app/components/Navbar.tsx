import { Link } from "react-router";
import Shuffle from "./Shuffle/Shuffle";

const Navbar = () => {
  return (
    <nav className="navbar flex items-center justify-between">
      <Link to="/" className="flex items-center">
        <span className="font-extrabold">
          <Shuffle
            className="text-sm"
            colorFrom="#000000"
            colorTo="#000000"
            text="HIRENEX"
            shuffleDirection="right"
            duration={0.35}
            animationMode="evenodd"
            shuffleTimes={1}
            ease="power3.out"
            stagger={0.03}
            threshold={0.1}
            triggerOnce={true} // animate one time
            triggerOnHover={true} // animate when hovered
            respectReducedMotion={true}
          />
        </span>
      </Link>

      <Link to="/upload">
        <p
          className="
          primary-button
          font-semibold
          text-base        /* reduce text size */
          px-4
          py-2
          h-auto
       "
        >Upload Resume
        </p>
      </Link>
    </nav>
  );
};

export default Navbar;
