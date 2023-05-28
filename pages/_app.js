import Head from "next/head";
import "../styles/globals.css";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../styles/theme";
import { ThemeProvider } from "@mui/material/styles";
import Navbar from "../components/navbar";
import { useRouter } from "next/router";
import { store } from "../store/index";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setProduct } from "../store/productSlice";
import axios from "axios";
import { setOrder } from "../store/orderSlice";

function MyApp({ Component, pageProps }) {
  // const dispatch = useDispatch();
  // const products = useSelector((state) => state.product.products);

  const router = useRouter();
  const [loading, setloading] = useState(false);

  const showNavbar = router.pathname.startsWith("/dashboard");

  useEffect(() => {
    const fetchdata = async () => {
      const responce1 = await axios.get("/api/getProducts");
      const responce2 = await axios.get("/api/getOrders");

      // setdata(responce.data.payload);
      store.dispatch(setProduct(responce1.data.payload));
      store.dispatch(setOrder(responce2.data.payload));
    };
    fetchdata();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
      router.push("/");
    }
  }, []);
  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {showNavbar && <Navbar />}
              <Component {...pageProps} />
            </ThemeProvider>
          </Provider>
        </>
      )}
    </>
  );
}

export default MyApp;
