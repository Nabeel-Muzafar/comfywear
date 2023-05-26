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

function MyApp({ Component, pageProps }) {
  // const dispatch = useDispatch();
  // const products = useSelector((state) => state.product.products);

  const router = useRouter();
  const [loading, setloading] = useState(false);
  console.log(router.pathname.startsWith("/dashboard"));
  const showNavbar = router.pathname.startsWith("/dashboard");

  useEffect(() => {
    const fetchdata = async () => {
      const responce = await axios.get("/api/getProducts");
      console.log(responce.data.payload);
      // setdata(responce.data.payload);
      store.dispatch(setProduct(responce.data.payload));
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
