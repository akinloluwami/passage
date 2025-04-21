import { Link, useLocation } from "@tanstack/react-router";
import { BsFillFileTextFill } from "react-icons/bs";
import { PiPasswordBold } from "react-icons/pi";
import { TbCreditCardFilled } from "react-icons/tb";

const Sidebar = () => {
  const links = [
    {
      label: "Passwords",
      href: "/app",
      icon: PiPasswordBold,
      color: "#3583ff",
    },
    {
      label: "Cards",
      href: "/app/cards",
      icon: TbCreditCardFilled,
      color: "#7f43ff",
    },
    {
      label: "Secure Notes",
      href: "/app/notes",
      icon: BsFillFileTextFill,
      color: "#ff62e8",
    },
  ];

  const location = useLocation();

  return (
    <div className="w-[348px] h-[calc(100vh-55px)] mt-7 bg-white backdrop-blur-lg rounded-3xl p-7">
      <div className="flex flex-col gap-y-5">
        {links.map((link) => (
          <Link
            to={link.href}
            className={`flex items-center gap-x-2 p-3 rounded-2xl transition-all duration-300 ${
              location.pathname === link.href
                ? "bg-gradient-to-r from-accent/20 to-purple-100"
                : "hover:bg-accent/10"
            }`}
          >
            <link.icon size={16} color={link.color} />{" "}
            <span className="text-sm font-medium text-gray-001">
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
