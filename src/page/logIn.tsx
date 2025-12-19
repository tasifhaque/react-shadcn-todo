import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { firebaseAuth, firebaseDB } from "@/lib/db";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { get, ref, set } from "firebase/database";

export function SigninPage() {
  const provider = new GoogleAuthProvider();

  const googleSignUp = async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const { user } = result;

      const userData = (await get(ref(firebaseDB, `users/${user?.uid}`))).val();

      if (!userData) {
        await set(ref(firebaseDB, `users/${user?.uid}`), {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
        });
      }
    } catch (err) {}
  };

  const navigate = useNavigate();

  const loginSchema = z.object({
    email: z.email({ message: "Invalid email!" }),
    password: z
      .string()
      .min(6, { message: "Password must be atleast 6 characters" }),
  });

  type formType = z.infer<typeof loginSchema>;

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const formSubmit = async (data: formType) => {
    try {
      const authStatus = await signInWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      );
      if (authStatus.user) {
        navigate("/", { replace: true });
      }
    } catch (r) {
      toast.error("Sign in Failed", {
        description:
          "Error signing in, please check your credentials and try again!",
      });
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
                <h1 className="text-2xl font-bold">Sign In to your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your email or sign in with google
                </p>
              </div>

              {/* Email field */}
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
              {/* Password */}
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
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin" /> Signing In
                  </>
                ) : (
                  "Sign In"
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
                  className="w-4"
                  src="/assets/Google_Logo_2025.png"
                  alt="google"
                />
                Sign in with Google
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?
                <a href="signup" className="underline underline-offset-4 px-2">
                  Sign up
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default SigninPage;
