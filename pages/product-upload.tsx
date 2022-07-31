import type { NextPage } from "next";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import update from "immutability-helper";

import styles from "../styles/Home.module.css";
import { UiFileInputButton } from "../components/UiFileInputButton";

interface BlobWithPreview extends Blob {
  preview?: string;
}

interface Products {
  file: Blob;
  preview: string;
  productName: string;
  price: number;
}

const ProductUpload: NextPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Products[]>([]);

  const onChange = async (files) => {
    Array.from(files).forEach(async (file: any) => {
      const previewUrl = URL.createObjectURL(file);

      setProducts((prev) => [
        ...prev,
        {
          file: file,
          preview: previewUrl,
          productName: `product - ${Math.random()
            .toString(36)
            .substring(2, 7)}`,
          price: Math.floor(Math.random() * 500),
        },
      ]);
    });
  };

  const handleUploadProducts = async () => {
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        console.log(
          `Current progress:`,
          Math.round((event.loaded * 100) / event.total)
        );
      },
    };

    const formData = new FormData();

    products.forEach(async (product: any) => {
      formData.append("theFiles", product.file);

      formData.append(
        "file",
        JSON.stringify({
          originalname: product.file.name,
          productName: product.productName,
          price: product.price,
        })
      );
    });

    await axios.post("/api/upload", formData, config);

    setProducts(() => []);
    router.push("/products");
  };

  const handleUpdateProductName = (event, idx: number) => {
    event.persist();

    const updatedProducts = update(products, {
      [idx]: {
        productName: {
          $set: event.target?.textContent || event.target?.innerText,
        },
      },
    });

    setProducts(updatedProducts);
  };

  const handleUpdateProductPrice = (event, idx: number) => {
    event.persist();

    const updatedProducts = update(products, {
      [idx]: {
        price: {
          $set:
            parseFloat(event.target?.textContent) ||
            parseFloat(event.target?.innerText),
        },
      },
    });

    setProducts(updatedProducts);
  };
  return (
    <div className={styles.container}>
      <div className="flex justify-between items-center p-10">
        <UiFileInputButton
          label="Select File/s"
          uploadFileName="theFiles"
          onChange={onChange}
          allowMultipleFiles
        />

        <button
          className="rounded-lg px-8 py-1 outline outline-offset-2 outline-blue-500"
          type="button"
          onClick={handleUploadProducts}
        >
          Upload files
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {products.length
          ? products.map((product, idx) => (
              <div
                className="max-w-sm bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
                key={idx}
              >
                <a href="#">
                  <Image
                    className="p-8 rounded-t-lg"
                    src={`${product.preview}`}
                    alt="product image"
                    width="100%"
                    height="100%"
                    layout="responsive"
                    objectFit="contain"
                  />
                </a>
                <div className="px-5 pb-5 mt-2">
                  <a href="#">
                    <h5
                      className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) => handleUpdateProductName(event, idx)}
                    >
                      {product.productName}
                    </h5>
                  </a>

                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ₱
                    </span>{" "}
                    <span
                      className="text-3xl font-bold text-gray-900 dark:text-white"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) => handleUpdateProductPrice(event, idx)}
                    >
                      {product.price}
                    </span>
                  </div>
                </div>
              </div>
            ))
          : ""}
      </div>
    </div>
  );
};

export default ProductUpload;
