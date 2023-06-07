import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import { Card, CardContent, Grid, Typography } from "@material-ui/core";

function DashBoard() {
  const products = useSelector((state) => state.product.products);
  const orders = useSelector((state) => state.order.orders);
  const [quantity, setquantity] = useState(0);
  const [loading, setloading] = useState(false);
  const [township, settownship] = useState(0);
  const [wapda, setwapda] = useState(0);
  const [wareHouse, setwareHouse] = useState(0);
  const [townshipProducts, settownshipProducts] = useState(0);
  const [wapdatownProducts, setwapdatownProducts] = useState(0);
  const [warehouseProducts, setwarehouseProducts] = useState(0);
  const [quantity1, setquantity1] = useState(0);
  const [quantity2, setquantity2] = useState(0)
  const [quantity3, setquantity3] = useState(0)
  const router = useRouter();

  console.log(products);

  useEffect(() => {
    setloading(true);
    if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
      router.push("/");
    } else {
      setloading(false);
    }
  }, [router.pathname]);


console.log(products)

  useEffect(() => {
    if (products) {
      let count = 0;

      for (let i = 0; i < products.length; i++) {
        count += products[i].quantity;
      }
      setquantity(count);
    }
  }, [products]);

  useEffect(() => {
    if (products) {
      let count = 0;
      let quantity00 = 0;
      let count2 = 0;
      let quantity11 = 0;
      let count3 = 0;
      let quantity22 = 0;
      for (let i = 0; i < products.length; i++) {
        if (products[i].productBranch == "warehouse") {
          count += 1;
          quantity00 += products[i].quantity
        } else if (products[i].productBranch == "township") {
          count2 += 1;
          quantity11 += products[i].quantity
        } else {
          count3 += 1;
          quantity22 += products[i].quantity
        }
      }
      setwarehouseProducts(count);
      setquantity1(quantity00)
      setquantity2(quantity11)
      setquantity3(quantity22)
      settownshipProducts(count2);
      setwapdatownProducts(count3);
    }
  }, [products]);

  useEffect(() => {
    if (orders) {
      let Wapdacount = 0;
      let townshipCount = 0;
      let warehouse = 0;
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].branch == "warehouse") {
          warehouse = orders[i].orders.length;
          setwareHouse(warehouse);
        } else if (orders[i].branch == "wapdatown") {
          Wapdacount = orders[i].orders.length;
          setwapda(warehouse);
        } else {
          townshipCount = orders[i].orders.length;
          settownship(townshipCount);
        }
      }
    }
  }, [orders]);

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid style={{ padding: "20px" }} container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                style={{
                  backgroundColor: "#002884",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography color="white" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {products ? products.length : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                style={{
                  backgroundColor: "#002884",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography color="white" gutterBottom>
                    Total Quantity of Product
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {quantity ? quantity : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
            <Card
                style={{
                  backgroundColor: "#002884",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography color="white" gutterBottom>
                    warehouse  Product Quantity 
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {quantity1 ? quantity1 : 0}
                  </Typography>
                </CardContent>
              </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
            <Card
                style={{
                  backgroundColor: "#002884",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography color="white" gutterBottom>
                    Township  Product Quantity 
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {quantity2 ? quantity2 : 0}
                  </Typography>
                </CardContent>
              </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
            <Card
                style={{
                  backgroundColor: "#002884",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography color="white" gutterBottom>
                    wapda  Product Quantity 
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {quantity3 ? quantity3 : 0}
                  </Typography>
                </CardContent>
              </Card>
              </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card
                style={{
                  backgroundColor: "#002884",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography color="white" gutterBottom>
                    Wapda Town Orders
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {wapda ? wapda : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                style={{
                  backgroundColor: "#002884",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography color="white" gutterBottom>
                    Town Ship Orders
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {township ? township : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                style={{
                  backgroundColor: "#002884",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography color="white" gutterBottom>
                    Ware House Orders
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {wareHouse ? wareHouse : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                style={{
                  backgroundColor: "#002884",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography color="white" gutterBottom>
                    Ware House Total Product
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {warehouseProducts ? warehouseProducts : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                style={{
                  backgroundColor: "#002884",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography color="white" gutterBottom>
                    Township Total Product
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {townshipProducts ? townshipProducts : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                style={{
                  backgroundColor: "#002884",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography color="white" gutterBottom>
                    Wapda Town Total Product
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {wapdatownProducts ? wapdatownProducts : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}

export default DashBoard;
