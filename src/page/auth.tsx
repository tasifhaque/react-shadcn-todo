import { firebaseAuth } from "@/lib/db";
import { onAuthStateChanged } from "firebase/auth";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router";

const Auth = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  onAuthStateChanged(firebaseAuth, (user) => {
    if (user?.uid) {
      navigate("/", { replace: true });
    }
    setPageLoading(false);
  });
  return pageLoading ? (
    <div className="flex items-center justify-center h-dvh">
      <div className="flex items-center gap-3">
        <Loader size={32} className="animate-spin" />
        Loading...
      </div>
    </div>
  ) : (
    <Outlet />
  );
};

export default Auth;
