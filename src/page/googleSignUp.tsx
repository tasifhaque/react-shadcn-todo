import { firebaseAuth } from "@/lib/db";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router";

const GoogleSignUp = () => {
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const googleSignUp = async () => {
    const googleSign = await signInWithPopup(firebaseAuth, provider)
      .then((user) => {})
        .catch((err) => { });
      if (googleSign?.user?.uid) {
        set(ref(firebaseDB, `users/${googleSign?.user?.uid}`), {
          
        });
      }
  };
    
  return <div></div>;
};

export default GoogleSignUp;
