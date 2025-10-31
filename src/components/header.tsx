import { Calendar, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewTaskForm from "@/components/newTaskForm";
import { useThemeStore } from "@/store/themeStore";
import { format } from "date-fns";

const Header = () => {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold">
          <span className="text-primary">Task</span>Pad
        </h2>
        <div className="flex items-center gap-1">
          <Calendar size={18} className="text-primary" />
          <p className="text-muted-foreground">{format(new Date(), "PPP")}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
        <NewTaskForm />
      </div>
    </div>
  );
};

export default Header;
