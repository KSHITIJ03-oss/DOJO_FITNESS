// /**
//  * Public-facing navbar for marketing website.
//  * Transparent over hero sections, sticky on scroll.
//  * Login/Register buttons link to existing admin authentication pages.
//  */
// import { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";



// const Navbar = () => {
//   const location = useLocation();
//   const [scrolled, setScrolled] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const isActive = (path) => location.pathname === path;
//   const isHeroPage = location.pathname === "/";

//   return (
//     <nav
//       className={`
//         fixed top-0 left-0 right-0 z-50 transition-all duration-300
//         ${
//           scrolled || !isHeroPage
//             ? "bg-gray-900/95 backdrop-blur-md shadow-lg"
//             : "bg-transparent"
//         }
//       `}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2">
//             <span className="text-3xl font-black text-primary-400">DOJO</span>
//             <span className="text-xl font-bold text-white">FITNESS</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link
//               to="/"
//               className={`px-3 py-2 text-sm font-semibold transition-colors ${
//                 isActive("/")
//                   ? "text-primary-400"
//                   : scrolled || !isHeroPage
//                   ? "text-gray-300 hover:text-primary-400"
//                   : "text-white hover:text-primary-400"
//               }`}
//             >
//               Home
//             </Link>
//             <Link
//               to="/try-us"
//               className={`px-3 py-2 text-sm font-semibold transition-colors ${
//                 isActive("/try-us")
//                   ? "text-primary-400"
//                   : scrolled || !isHeroPage
//                   ? "text-gray-300 hover:text-primary-400"
//                   : "text-white hover:text-primary-400"
//               }`}
//             >
//               Try Us
//             </Link>
//             <Link
//               to="/join-us"
//               className={`px-3 py-2 text-sm font-semibold transition-colors ${
//                 isActive("/join-us")
//                   ? "text-primary-400"
//                   : scrolled || !isHeroPage
//                   ? "text-gray-300 hover:text-primary-400"
//                   : "text-white hover:text-primary-400"
//               }`}
//             >
//               Join Us
//             </Link>
//             <Link
//               to="/contact"
//               className={`px-3 py-2 text-sm font-semibold transition-colors ${
//                 isActive("/contact")
//                   ? "text-primary-400"
//                   : scrolled || !isHeroPage
//                   ? "text-gray-300 hover:text-primary-400"
//                   : "text-white hover:text-primary-400"
//               }`}
//             >
//               Contact
//             </Link>
//             <div className="h-6 w-px bg-gray-600"></div>
//             <Link
//               to="/login"
//               className={`px-4 py-2 text-sm font-semibold transition-colors ${
//                 scrolled || !isHeroPage
//                   ? "text-gray-300 hover:text-primary-400"
//                   : "text-white hover:text-primary-400"
//               }`}
//             >
//               Login
//             </Link>
//             <Link
//               to="/register"
//               className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
//             >
//               Register
//             </Link>
//           </div>
//           {mobileOpen && (
//             <div className="md:hidden absolute top-20 left-0 w-full bg-gray-900/95 backdrop-blur-md border-t border-gray-800 z-[10000]">
//               <div className="flex flex-col px-6 py-6 space-y-4">
//                 {[
//                   { to: "/", label: "Home" },
//                   { to: "/try-us", label: "Try Us" },
//                   { to: "/join-us", label: "Join Us" },
//                   { to: "/contact", label: "Contact" },
//                 ].map(({ to, label }) => (
//                   <Link
//                     key={to}
//                     to={to}
//                     onClick={() => setMobileOpen(false)}
//                     className="text-white text-lg font-semibold py-2 border-b border-gray-800"
//                   >
//                     {label}
//                   </Link>
//                 ))}

//                 <Link
//                   to="/login"
//                   onClick={() => setMobileOpen(false)}
//                   className="text-gray-300 py-2"
//                 >
//                   Login
//                 </Link>

//                 <Link
//                   to="/register"
//                   onClick={() => setMobileOpen(false)}
//                   className="bg-primary-600 text-white text-center py-3 rounded-lg font-semibold"
//                 >
//                   Register
//                 </Link>
//               </div>
//             </div>
//           )}

//           {/* Mobile Menu Button */}
//           {/* <button
//             className="md:hidden text-white p-2"
//             aria-label="Menu"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button> */}
//           <button
//             className="md:hidden text-white p-2 relative z-[10001]"
//             aria-label="Menu"
//             onClick={() => setMobileOpen((prev) => !prev)}
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d={
//                   mobileOpen
//                     ? "M6 18L18 6M6 6l12 12" // X icon
//                     : "M4 6h16M4 12h16M4 18h16" // Hamburger
//                 }
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

/**
 * Public-facing navbar for marketing website.
 * Transparent over hero sections, sticky on scroll.
 * Login/Register buttons link to existing admin authentication pages.
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// import CTAButton from "./CTAButton";
import Button from "../forms/Button";

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;
  const isHeroPage = location.pathname === "/";

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            scrolled || !isHeroPage
              ? "bg-gray-900/95 backdrop-blur-md shadow-lg"
              : "bg-transparent"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl font-black text-primary-400">DOJO</span>
              <span className="text-xl font-bold text-white">FITNESS</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { to: "/", label: "Home" },
                { to: "/try-us", label: "Try Us" },
                { to: "/join-us", label: "Join Us" },
                { to: "/contact", label: "Contact" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive(to)
                      ? "text-primary-400"
                      : scrolled || !isHeroPage
                      ? "text-gray-300 hover:text-primary-400"
                      : "text-white hover:text-primary-400"
                  }`}
                >
                  {label}
                </Link>
              ))}

              <div className="h-6 w-px bg-gray-600"></div>

              <Link
                to="/login"
                className={`px-4 py-2 text-sm font-semibold transition-colors ${
                  scrolled || !isHeroPage
                    ? "text-gray-300 hover:text-primary-400"
                    : "text-white hover:text-primary-400"
                }`}
              >
                Login
              </Link>

              {/* <Link  */}
              <Link to="/register">
                <Button>
                  Register
                </Button>
              </Link>
              
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2 relative z-[10001]"
              aria-label="Menu"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileOpen
                      ? "M6 18L18 6M6 6l12 12" // X
                      : "M4 6h16M4 12h16M4 18h16" // Hamburger
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* DARK BACKDROP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] md:hidden"
        />
      )}

      {/* SLIDING MOBILE MENU (RIGHT → LEFT) */}
      <div
        className={`
          fixed top-0 right-0 h-screen w-[80%] max-w-sm
          bg-gray-900/95 backdrop-blur-xl
          border-l border-gray-800
          z-[10000]
          transform transition-transform duration-300 ease-out
          md:hidden
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="pt-24 px-6 flex flex-col space-y-6">
          {[
            { to: "/", label: "Home" },
            { to: "/try-us", label: "Try Us" },
            { to: "/join-us", label: "Join Us" },
            { to: "/contact", label: "Contact" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="text-white text-lg font-semibold py-2 border-b border-gray-800"
            >
              {label}
            </Link>
          ))}

          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="text-gray-300 py-2"
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={() => setMobileOpen(false)}
            className="bg-primary-600 text-white text-center py-3 rounded-lg font-semibold"
          >
            Register
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
