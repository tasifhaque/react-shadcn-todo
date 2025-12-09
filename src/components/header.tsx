import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/themeStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/db";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/authStore";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      navigate("/auth/signin");
    } catch {
      alert("Error signing out...");
    }
  };

  const { theme, toggleTheme } = useThemeStore();
  return (
    <div className="shadow flex items-center py-3 border-b">
      <div className="flex items-center justify-between container mx-auto">
        <h2 className="text-2xl font-bold">
          <span className="text-primary">Task</span>Pad
        </h2>

        <div className="flex gap-4">
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="shadow border cursor-pointer">
                <AvatarImage src="https://github.com/askdhgaksjhdgn.png" />
                <AvatarFallback>T</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex flex-col gap-1">
                {user?.name}
                <p className="text-muted-foreground">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
