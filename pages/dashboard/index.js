import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";

function DashBoard() {
  const [loading, setloading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setloading(true);
    if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
      router.push("/");
    } else {
      setloading(false);
    }
  }, [router.pathname]);

  return <>{loading ? <CircularProgress /> : <>dashboard</>}</>;
}

export default DashBoard;
