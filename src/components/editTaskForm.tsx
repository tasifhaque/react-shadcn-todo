import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState } from "react";
import { type TodoType } from "@/store/todoStore";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { ref, set } from "firebase/database";
import { firebaseDB } from "@/lib/db";

const EditTaskForm = ({ todo }: { todo: TodoType }) => {
  const { user } = useAuthStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [popOverOpen, setPopOverOpen] = useState(false);

  const taskSchema = z.object({
    title: z.string().nonempty({ message: "Title required" }),
    description: z.string().nonempty({ message: "Description is required" }),
    date: z.date({ message: "Please select a date!" }),
    complete: z.boolean(),
  });

  type FormType = z.infer<typeof taskSchema>;

  const form = useForm<FormType>({
    defaultValues: {
      title: todo.title,
      description: todo.description,
      date: new Date(todo.date),
      complete: todo.complete,
    },
    resolver: zodResolver(taskSchema),
  });
  const { handleSubmit, control } = form;

  const onSubmit = (data: FormType) => {
    const taskToast = toast;

    const findTodo = user?.todos?.find((to) => {
      return to.id === todo.id;
    });
    const otherTodos = user?.todos?.filter((to) => {
      return to.id !== todo.id;
    });

    console.log(findTodo, otherTodos);

    if (findTodo) {
      const updatedTodo: TodoType = {
        id: findTodo.id,
        title: data.title!,
        description: data.description!,
        date: new Date(data.date).toISOString(),
        complete: data.complete!,
        createdAt: findTodo.createdAt,
        updatedAt: new Date().toISOString(),
      };
      set(ref(firebaseDB, `users/${user?.uid}`), {
        ...user,
        todos: [...(otherTodos || []), updatedTodo],
      });
    }

    taskToast.success("Task updated successfully", {
      description: `Task ${data.title} updated successfully for ${format(
        data.date,
        "PPP"
      )}`,
    });
    setDialogOpen(!dialogOpen);
    form.reset();
  };

  return (
    <DropdownMenuItem asChild>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full font-normal text-left justify-start",
              "px-2! py-1.5!"
            )}
          >
            <Pencil /> Edit
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Please fill up the form below and press add task to create a new
              task
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-2"
            >
              {/* Task title */}
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* task description */}
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Task Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter task description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* task date */}
              <FormField
                control={control}
                name="date"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Task Date</FormLabel>
                    <FormControl>
                      <Popover open={popOverOpen} onOpenChange={setPopOverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            data-empty={!field.value}
                            className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
                          >
                            <CalendarIcon />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={(e) => {
                              setPopOverOpen(!popOverOpen);
                              field.onChange(e);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Task status */}
              <FormField
                control={control}
                name="complete"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Task Status</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Switch
                          defaultChecked={field.value}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        {field.value ? "Complete" : "Pending"}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-full flex items-center justify-end gap-3">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Update task</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DropdownMenuItem>
  );
};

export default EditTaskForm;
