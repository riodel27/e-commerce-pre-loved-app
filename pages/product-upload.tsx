import type { NextPage } from "next";
import axios from "axios";
import Image from "next/image";
import { uniq } from "lodash";
import { useState } from "react";

import styles from "../styles/Home.module.css";
import { UiFileInputButton } from "../components/UiFileInputButton";

interface BlobWithPreview extends Blob {
  preview?: string;
}

const ProductUpload: NextPage = () => {
  const [images, setImages] = useState<{ file: Blob; preview: string }[]>([]);
  // const [files, setFiles] = useState([]);

  const onChange = async (files) => {
    console.log("files: ", files);

    console.log("FILES: ", files);

    // setFiles(files);
    // const formData = new FormData();

    Array.from(files).forEach((file: any) => {
      // formData.append("theFiles", file);

      const previewUrl = URL.createObjectURL(file);

      console.log("file: ", file);

      console.log("file type: ", file.type);

      console.log("preview url: ", previewUrl);

      setImages((prev) => [...prev, { file, preview: previewUrl }]);
    });

    // console.log("FORM DATA: ", formData);

    // for (const pair of files.entries()) {
    //   console.log(`${pair[0]}, ${pair[1]}`);

    //   const previewUrl = URL.createObjectURL(pair[1]);

    //   console.log("file type: ", pair[1].type);

    //   console.log("preview url: ", previewUrl);

    //   setImages((prev) => [...prev, { ...pair[1], preview: previewUrl }]);
    // }

    //   // const response = await axios.post("/api/upload", formData, config);

    //   // console.log("response", response.data);

    //   // setImages((prev) => uniq([...prev, ...response.data.data]));
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
        onClick={async () => {
          // upload files here

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

          // Array.from(event.target.files).forEach((file) => {
          //   formData.append(event.target.name, file);
          // });

          images.forEach((image) => {
            formData.append("theFiles", image.file);
            formData.append(
              "productName",
              Math.random().toString(36).substring(2, 7)
            );
          });

          // images to formData???
          const response = await axios.post("/api/upload", formData, config);

          console.log("upload response: ", response);
        }}
      >
        {" "}
        Upload files
      </button>

      {/* todo: selected file to upload will be a product to be created in the database */}
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
              </div>
            ))
          : ""}
      </div>
    </div>
  );
};

export default ProductUpload;
