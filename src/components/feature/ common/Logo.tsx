import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Logosrc from "@/assets/logo.jpg";

function Logo() {
  return (
    <Link to="/" aria-label="FH-Shop">
      <div className="flex items-center gap-2">
        <Avatar className="h-10 w-10 rounded-full overflow-hidden">
          <AvatarImage src={Logosrc} alt="FH-Shop" />
        </Avatar>

        <span className="text-lg font-bold hidden sm:inline-block">
          凤凰商城
        </span>
      </div>
    </Link>
  );
}

export default Logo;
