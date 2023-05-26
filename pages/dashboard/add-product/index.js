import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Input,
  Select,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Box,
  TextField,
  NativeSelect,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Index = () => {
  const [isLoading, setisLoading] = useState(false);
  const [uploading, setuploading] = useState(false);
  const [location, setlocation] = useState();
  const [progress, setprogress] = useState(0);
  const [pic, setpic] = useState();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      variant: [{ size: "", quantity: 0, price: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variant",
  });

  useEffect(() => {
    if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
      router.push("/");
    }
  }, [router.pathname]);

  const onSubmit = async (data) => {
    if (!pic.url) {
      return;
    }
    setuploading(true);
    setisLoading(true);
    try {
      const responce = await axios.post("/api/addproduct", {
        data,
        // isvariant,
        picUrl: pic.url,
      });

      if (responce.data.success) {
        setisLoading(false);
        reset();
        setlocation("");
        setuploading(false);
      }
    } catch (error) {
      setisLoading(false);
      setuploading(false);
    }
  };

  const apiKey = "123328373753255";
  const cloudName = "da7eumrs4";
  const filesubmit = async () => {
    // toast("Wow so easy!")
    const file = document.getElementById("img").files[0];
    if (file.size > 1000000) {
      // size is greater than 1mb error

      toast.error("image size cannot be greater than 1mb");
      return;
    }
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      // format error

      toast("only JPEG and PNG are allowed");

      return;
    }
    //   console.log(file);
    //   console.log(URL.createObjectURL(file))
    setlocation(URL.createObjectURL(file));
    setuploading(true);
    const data = new FormData();
    data.append("file", document.getElementById("img").files[0]);
    data.append("api_key", apiKey);
    data.append("upload_preset", "comfywear");

    try {
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: function (e) {
            setprogress(Math.trunc((e.loaded / e.total) * 100));
          },
        }
      );
      if (cloudinaryResponse.status == 200) {
        setpic({
          publicKey: cloudinaryResponse.data.public_id,
          url: cloudinaryResponse.data.url,
        });
        setuploading(false);
        setprogress(0);
      } else {
        setuploading(false);
        setlocation("");
        toast.error("Error while uploading image");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while uploading image");
      setlocation("");
    }
  };
  const clickfileinput = () => {
    document.getElementById("img").click();
  };

  return (
    <>
      <ToastContainer />
      <Paper
        elevation={3}
        style={{
          padding: "1rem 0px",
          width: "90%",
          marginInline: "auto",
          marginTop: "2rem",
        }}
      >
        <Box mt={"2rem"} ml="2rem">
          <Typography fontWeight={"bold"} fontSize={"2rem"}>
            Add Product
          </Typography>
        </Box>

        <Box textAlign="center" marginBottom="20px">
          <Button
            component="label"
            style={{
              top: "116px",
              borderRadius: "100%",
              zIndex: "999",
              backgroundColor: "whitesmoke",
              height: "30px",
              width: "30px",
              minWidth: "30px",
              marginLeft: "84px",
            }}
            onClick={clickfileinput}
          >
            <img
              src="/camera.svg"
              alt="Edit "
              style={{
                color: "darkslategray",
                height: "1em",
                width: "1em",
              }}
            />
          </Button>
          <Avatar
            src={location}
            style={{
              height: "120px",
              width: "120px",
              margin: "auto",
            }}
          />
          <input id="img" hidden type="file" onInput={filesubmit} />
          <CircularProgress variant="determinate" value={progress} />
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display={"flex"}
            justifyContent={"center"}
            gap={"1rem"}
            flexWrap={"wrap"}
            marginTop={"1rem"}
          >
            <TextField
              type="text"
              placeholder="Product Code"
              {...register("productcode", { required: true })}
            />
            <TextField
              type="text"
              style={{
                width: "40%",
              }}
              placeholder="Product name"
              {...register("title", { required: true })}
            />
            <TextField
              type="number"
              placeholder="Quantity"
              {...register("quantity", { required: true })}
            />
            <TextField
              type="number"
              placeholder="Rate"
              {...register("Price", { required: true })}
            />
            <TextField
              type="number"
              placeholder="Discount in %"
              {...register("discount", {
                required: true,
              })}
            />
          </Box>
          <Box
            marginY={"2rem"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={"1rem"}
          >
            <Box width={"20%"}>
              <FormControl fullWidth>
                <InputLabel id="age">Brand</InputLabel>
                <Select
                  id="age"
                  style={{ width: "70%" }}
                  label="Select-option"
                  placeholder="Select-option"
                  {...register("brand", { required: true })}
                >
                  <MenuItem value="Select-option">Select-option</MenuItem>
                  <MenuItem value="comfywear">Comfy Wear</MenuItem>
                  <MenuItem value="bin-saeed">Bin Saeed</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box width={"20%"}>
              <FormControl fullWidth>
                <InputLabel id="stuf">Select Stuff</InputLabel>
                <Select
                  id={"stuf"}
                  style={{ width: "70%" }}
                  label="Select-Stuff"
                  placeholder="Select-option"
                  {...register("stuff", { required: true })}
                >
                  <MenuItem value="none">Select-option</MenuItem>
                  <MenuItem value="Loan">Loan</MenuItem>
                  <MenuItem value="Embroidery">Embroidery</MenuItem>
                  <MenuItem value="Linen">Linen</MenuItem>
                  <MenuItem value="Cotton">Cotton</MenuItem>
                  <MenuItem value="Silk">Silk</MenuItem>
                  <MenuItem value="Chiffon">Chiffon</MenuItem>
                  <MenuItem value="Organza">Organza</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box width={"20%"}>
              <FormControl fullWidth>
                <InputLabel id="category">Select Category</InputLabel>
                <Select
                  id="category"
                  style={{ width: "70%" }}
                  label="Select-Category"
                  placeholder="Select-option"
                  {...register("category", { required: true })}
                >
                  <MenuItem value="none">Select-option</MenuItem>
                  <MenuItem value="3-piece">3-piece</MenuItem>
                  <MenuItem value="2-piece">2-piece</MenuItem>
                  <MenuItem value="single">single</MenuItem>
                  <MenuItem value="none">None</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box width={"20%"}>
              <FormControl fullWidth>
                <InputLabel id="status">Select Status</InputLabel>
                <Select
                  id="status"
                  style={{ width: "70%" }}
                  label="Select-Status"
                  placeholder="Select-option"
                  {...register("status", { required: true })}
                >
                  <MenuItem value="none">Select-option</MenuItem>
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="out-of-stock">out-of-stock</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* <Box width={"80%"} mx="auto">
            <Box>Add Variant</Box>
            <Box>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  Do you have variant
                </FormLabel>

                <RadioGroup
                  onChange={(e) => setisvariant(e.target.value)}
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="no"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="yes"
                  />
                  <FormControlLabel value="no" control={<Radio />} label="no" />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box display={isvariant === "no" ? "none" : "block"} my={"1rem"}>
              {fields.map((item, index) => {
                return (
                  <Box
                    sx={{ display: "flex", gap: "1rem", alignItems: "center" }}
                    key={item.id}
                  >
                    <FormControl style={{ width: "10%" }}>
                      <InputLabel id="size">Size</InputLabel>
                      <Select
                        id="size"
                        label="Size"
                        {...register(`variant.${index}.size`)}
                      >
                        <MenuItem value="none">Select-option</MenuItem>
                        <MenuItem value="small">small</MenuItem>
                        <MenuItem value="medium">medium</MenuItem>
                        <MenuItem value="large">large</MenuItem>
                        <MenuItem value="xl">xl</MenuItem>
                      </Select>
                    </FormControl>

                    <Controller
                      render={({ field }) => (
                        <TextField
                          type="number"
                          margin="normal"
                          label="quantity"
                          {...field}
                        />
                      )}
                      name={`variant.${index}.quantity`}
                      control={control}
                    />
                    <TextField
                      type="number"
                      margin="normal"
                      label="Price"
                      {...register(`variant.${index}.price`)}
                    />
                    <Button
                      variant="contained"
                      color="warning"
                      type="button"
                      style={{
                        height: "40px",
                      }}
                      onClick={() => remove(index)}
                    >
                      Delete
                    </Button>
                  </Box>
                );
              })}
              <Box>
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => {
                    append({ size: "S", quantity: 1, price: 0 });
                  }}
                >
                  Add more
                </Button>
              </Box>
            </Box>
          </Box> */}
          <Box my="1rem" width={"80%"} marginX={"auto"}>
            <Button
              endIcon={
                isLoading && <CircularProgress size={20} color="inherit" />
              }
              fullWidth
              variant="contained"
              type="submit"
              disabled={uploading}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </>
  );
};

export default Index;
