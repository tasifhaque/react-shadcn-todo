import { format, isAfter } from "date-fns";
import { Calendar, MoreHorizontal, SearchX, Trash } from "lucide-react";
import Header from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { useTodoStore } from "@/store/todoStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Fragment } from "react/jsx-runtime";
import { Checkbox } from "@/components/ui/checkbox";
import EditTaskForm from "@/components/editTaskForm";
import { toast } from "sonner";
import NewTaskForm from "./components/newTaskForm";

const App = () => {
  const { todo, deleteTodo, updateTodo } = useTodoStore();

  const groupedTodo = Object.groupBy(todo, ({ date }) => {
    return format(new Date(date), "PPP");
  });

  return (
    <>
      <Header />
      <div className="flex flex-col gap-3 py-6 container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-lg">
            <Calendar size={18} className="text-primary" />
            <p className="text-muted-foreground">{format(new Date(), "PPP")}</p>
          </div>
          <NewTaskForm />
        </div>
        <Card>
          <CardContent className="grid gap-3">
            {todo.length === 0 && (
              <div className="flex flex-col items-center justify-center">
                <SearchX size={49} className="text-primary" />
                <h2 className="text-primary font-bold text-2xl">
                  No task found
                </h2>
                <p className="text-muted-foreground">
                  Please create a task from add task button above
                </p>
              </div>
            )}

            {Object.keys(groupedTodo).map((dateKey) => (
              <Fragment key={dateKey}>
                <p className="text-primary font-bold">{dateKey}</p>
                {groupedTodo[dateKey]?.map(
                  ({
                    id,
                    title,
                    description,
                    complete,
                    date,
                    createdAt,
                    updatedAt,
                  }) => {
                    const isTaskDue = isAfter(new Date(), new Date(date));
                    return (
                      <Card className="shadow-none" key={id}>
                        <CardContent className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Checkbox
                              checked={complete}
                              onCheckedChange={(s) => {
                                updateTodo(id, {
                                  title,
                                  description,
                                  complete: s as boolean,
                                  date,
                                });
                              }}
                            />
                            <div className="flex flex-col">
                              <p className="font-bold text-lg">{title}</p>
                              <p className="">{description}</p>
                              <p className="text-sm text-muted-foreground">
                                Created: {format(new Date(createdAt), "PPP")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Due:{" "}
                                <span
                                  className={
                                    !complete
                                      ? isTaskDue
                                        ? "text-rose-600"
                                        : ""
                                      : "text-green-600"
                                  }
                                >
                                  {format(date, "PPP")}
                                </span>
                                {updatedAt &&
                                  ` | Last updated: ${format(
                                    new Date(updatedAt),
                                    "do MMM yyyy, h:mm aa"
                                  )}`}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <EditTaskForm
                                todo={{
                                  id,
                                  title,
                                  description,
                                  date,
                                  complete,
                                  createdAt,
                                  updatedAt,
                                }}
                              />
                              <DropdownMenuItem
                                onClick={() => {
                                  deleteTodo(id);
                                  toast.success(`Task deleted successfully`, {
                                    description: `Task ${title} deleted successfully`,
                                  });
                                }}
                              >
                                <Trash /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardContent>
                      </Card>
                    );
                  }
                )}
              </Fragment>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default App;
