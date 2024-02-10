"use client";

import Input from "@/components/Input";
import { websiteHost } from "@/utils/constants";
import axios from "axios";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Admin() {
  const [name, setName] = useState<string>("");
  const [retailer, setRetailer] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [productimage, setProductImage] = useState<File | undefined>(undefined);
  const [texture, setTexture] = useState<File | undefined>(undefined);
  const [category, setCategory] = useState<string>("");

  const toastOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const handlesubmit = (event: any) => {
    event.preventDefault();

    // HANDLE ERROR
    if (name.length === 0) {
      return toast.warn("Name is required", toastOptions);
    }
    if (retailer.length === 0) {
      return toast.warn("Retailer is required", toastOptions);
    }

    if (!price) {
      return toast.warn("Price is required", toastOptions);
    }
    if (isNaN(parseInt(price))) {
      if (parseInt(price) <= 0) {
        return toast.warn("Price should be positive integer", toastOptions);
      }
      return toast.warn("Price should be number", toastOptions);
    }
    if (brand.length === 0) {
      return toast.warn("Brand is required", toastOptions);
    }
    if (category.length === 0) {
      return toast.warn("Category is required", toastOptions);
    }
    if (!["top", "bottom", "foot"].includes(category)) {
      return toast.warn('Category can only be "top" "botton" or "foot" ');
    }
    if (texture === undefined) {
      return toast.warn("Upload a texture", toastOptions);
    }
    if (productimage === undefined) {
      return toast.warn("Upload Product image", toastOptions);
    }
    toast.info("Uploading!! Hold tight 🙏🏼");
    if (name && retailer && price && brand && productimage && texture) {
      const formData = new FormData();

      formData.append("image", productimage);
      formData.append("name", name);
      formData.append("brand", brand);
      formData.append("retailer_name", retailer);
      formData.append("price", price);
      formData.append("texture", texture);
      formData.append("category", category);

      axios.post(`${websiteHost}api/admin/upload-product`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(() => {
          setPrice("");
          setProductImage(undefined);
          setTexture(undefined);
          setName("");
          setBrand("");
          setCategory("");
          setRetailer("");
          toast("SUCESS 🎉", toastOptions);
        })
        .catch(() => {
          toast.error("ERROR ❌", toastOptions);
        });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-right bg-lightBeige p-4 lg:p-24">
      <h1 className="text-5xl font-black font-mono mb-10">ADMIN</h1>
      <form
        className="flex flex-col max-w-96 space-y-5"
        onSubmit={handlesubmit}
      >
        <Input
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Retailer"
          type="text"
          value={retailer}
          onChange={(e) => setRetailer(e.target.value)}
        />
        <Input
          placeholder="Price"
          type="text"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
          }}
        />
        <Input
          placeholder="Brand"
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <Input
          placeholder="Category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <section>
          <h1 className="inline-flex text-xl font-black font-mono">
            Product Image
          </h1>
          <FileUploader
            handleChange={(file: File) => setProductImage(file)}
            name="file"
            types={["JPG", "PNG", "JPEG"]}
          />
        </section>

        <section>
          <h1 className="inline-flex w-2/3 text-xl font-black font-mono">
            Texture Map
          </h1>
          <FileUploader
            handleChange={(file: File) => setTexture(file)}
            name="file"
            types={["JPG", "PNG", "JPEG"]}
          />
        </section>
        <button
          type="submit"
          className="font-mono font-black p-5 max-w-fit h-10 inline-flex justify-center border border-accBlack rounded-md items-center bg-satRed text-lightBeige hover:bg-satRed-hover hover:text-white"
        >
          Submit
        </button>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </form>
    </main>
  );
}
