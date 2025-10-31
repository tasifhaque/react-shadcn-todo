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
import { CalendarIcon, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState } from "react";
import { useTodoStore } from "@/store/todoStore";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";

const NewTaskForm = () => {
  const { createTodo } = useTodoStore();

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
      title: "",
      description: "",
      date: new Date(),
      complete: false,
    },
    resolver: zodResolver(taskSchema),
  });
  const { handleSubmit, control } = form;

  const onSubmit = (data: FormType) => {
    const taskToast = toast;

    createTodo({
      title: data.title,
      description: data.description,
      date: data.date.toISOString(),
      complete: data.complete,
    });

    taskToast.success("Task created successfully", {
      description: `Task ${data.title} created successfully for ${format(
        data.date,
        "PPP"
      )}`,
    });
    setDialogOpen(!dialogOpen);
    form.reset();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus /> Add New Task
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
                    <Textarea placeholder="Enter task description" {...field} />
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
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />{" "}
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
              <Button type="submit">Create task</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskForm;
