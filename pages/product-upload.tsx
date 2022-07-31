import type { NextPage } from "next";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

import styles from "../styles/Home.module.css";
import { UiFileInputButton } from "../components/UiFileInputButton";

interface BlobWithPreview extends Blob {
  preview?: string;
}

const ProductUpload: NextPage = () => {
  const router = useRouter();
  const [images, setImages] = useState<
    { file: Blob; preview: string; productName: string }[]
  >([]);

  const onChange = async (files) => {
    Array.from(files).forEach(async (file: any) => {
      const previewUrl = URL.createObjectURL(file);

      setImages((prev) => [
        ...prev,
        {
          file: file,
          preview: previewUrl,
          productName: Math.random().toString(36).substring(2, 7),
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

    images.forEach(async (image: any) => {
      formData.append("theFiles", image.file);

      formData.append(
        "file",
        JSON.stringify({
          originalname: image.file.name,
          productName: image.productName,
        })
      );
    });

    await axios.post("/api/upload", formData, config);

    setImages(() => []);
    router.push("/products");
  };

  return (
    <div className={styles.container}>
      <UiFileInputButton
        label="Select File/s"
        uploadFileName="theFiles"
        onChange={onChange}
        allowMultipleFiles
      />

      <button
        className="rounded-lg px-8 py-1 outline outline-offset-2 outline-blue-500 mt-10"
        type="button"
        onClick={handleUploadProducts}
      >
        Upload files
      </button>

      <div className="grid grid-cols-3 gap-4">
        {images.length
          ? images.map((image, idx) => (
              <div key={idx}>
                <Image
                  src={`${image.preview}`}
                  alt="staci image"
                  width="100%"
                  height="100%"
                  layout="responsive"
                  objectFit="contain"
                />
                <input
                  placeholder="product name"
                  value={image.productName}
                  onChange={(e) =>
                    console.log("e target value: ", e.target.value)
                  }
                />
              </div>
            ))
          : ""}
      </div>
    </div>
  );
};

export default ProductUpload;
