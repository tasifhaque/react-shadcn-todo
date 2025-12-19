import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { firebaseAuth, firebaseDB } from "@/lib/db";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { Loader } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";
import z from "zod";

const SignupPage = () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const googleSignUp = async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const { user } = result;

      const userData = (await get(ref(firebaseDB, `users/${user?.uid}`))).val();

      if (!userData) {
        await set(ref(firebaseDB, `users/${user?.uid}`), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          todos: [{ date: new Date().toLocaleDateString() }],
        });
      }
    } catch (err) {}
  };

  const signUpSchema = z.object({
    firstName: z.string().nonempty({ message: "First Name is required!" }),
    lastName: z.string().nonempty({ message: "Last Name is required!" }),
    email: z.email({ message: "Invalid email!" }),
    password: z
      .string()
      .min(6, { message: "Password must be atleast 6 characters!" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be atleast 6 characters!" }),
  });

  type formType = z.infer<typeof signUpSchema>;

  const {
    handleSubmit,
    control,
    setError,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  const formSubmit = async (data: formType) => {
    if (data.password !== data.confirmPassword) {
      setError("password", { message: "Password doesn't match" });
      setError("confirmPassword", { message: "Password doesn't match" });
      return;
    }
    try {
      const authStatus = await createUserWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      );

      console.log(authStatus?.user?.uid);
      if (authStatus?.user?.uid) {
        set(ref(firebaseDB, `users/${authStatus?.user?.uid}`), {
          uid: authStatus?.user?.uid,
          name: data?.firstName + " " + data?.lastName,
          email: data?.email,
          todos: [{ date: new Date().toLocaleDateString() }],
        });
      }
    } catch (e) {
      //@ts-ignore
      if (String(e.message).includes("email-already-in-use")) {
        toast.error("Already have an account with this email", {
          description:
            "The email your'e trying to use is already registered in your system, plase try to login instead.",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="">
        <Card className="min-w-sm max-w-md">
          <CardContent>
            <form
              className="flex flex-col gap-6 container mx-auto my-4"
              onSubmit={handleSubmit(formSubmit)}
            >
              <div className="flex flex-col items-center gap-1 text-center">
                <a href="/" className="text-2xl font-bold">
                  <span className="text-primary">Task</span>Pad
                </a>
                <h1 className="text-2xl font-bold">Create a new account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your details or sign up with google
                </p>
              </div>

              {/* first name section */}
              <Controller
                name="firstName"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="grid gap-2">
                    <Label>First Name</Label>
                    <Input
                      placeholder="First Name"
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {fieldState.error && (
                      <p className="text-destructive text-sm">
                        {fieldState?.error?.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* //last name section */}

              <Controller
                name="lastName"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="grid gap-2">
                    <Label>Last Name</Label>
                    <Input
                      placeholder="Last Name"
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {fieldState.error && (
                      <p className="text-destructive text-sm">
                        {fieldState?.error?.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* email section */}
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input
                      placeholder="something@example.com"
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {fieldState.error && (
                      <p className="text-destructive text-sm">
                        {fieldState?.error?.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* password section */}
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="grid gap-2">
                    <Label>Password</Label>
                    <Input
                      placeholder="password"
                      type="password"
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {fieldState.error && (
                      <p className="text-destructive text-sm">
                        {fieldState?.error?.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* confirm password section */}
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="grid gap-2">
                    <Label>Confirm Password</Label>
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {fieldState.error && (
                      <p className="text-destructive text-sm">
                        {fieldState?.error?.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* sign up button */}

              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin" /> Signing Up
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
              <FieldSeparator>Or continue with</FieldSeparator>
              <Button
                variant="outline"
                type="button"
                onClick={googleSignUp}
                className="cursor-pointer"
              >
                <img
                  className="w-4 "
                  src="/assets/Google_Logo_2025.png"
                  alt="google"
                />
                Sign up with Google
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?
                <Link
                  to="/auth/signin"
                  className="underline underline-offset-4 px-2"
                >
                  Log In
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
