import type { NextPage } from "next";
import axios from "axios";
import Image from "next/image";
import { uniq } from "lodash";
import { useEffect, useState } from "react";

import styles from "../styles/Home.module.css";

const ProductUpload: NextPage = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await axios.get("/api/products");

      setImages((prev) => uniq([...prev, ...response.data.data]));
    };

    fetchImages();
  }, []);

  return (
    <div className={styles.container}>
      <div className="grid grid-cols-3 gap-4">
        {images.length
          ? images.map((image, idx) => (
              <div key={idx}>
                <Image
                  src={`/uploads/${image}`}
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

//todo: learn next js data fetching. maybe pre-render technique

export default ProductUpload;
