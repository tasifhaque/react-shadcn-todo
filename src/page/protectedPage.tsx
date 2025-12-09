import { useAuthStore } from "@/store/authStore";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

const ProtectedPage = () => {
  const navigate = useNavigate();
  const { user, authLoading } = useAuthStore();

  useEffect(() => {
    if (!user) {
      navigate("/auth/signin", { replace: true });
    }
  }, [user]);

  return authLoading ? (
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

export default ProtectedPage;
