// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { ApiResponse } from "./upload";

type ResponseData = ApiResponse<string[], string>;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const filenames = fs.readdirSync("./public/uploads");

  //todo: is this where I will create the product with product id saved in the public uploads?

  const images = filenames.map((name) => name);
  res.status(200).json({ data: images });
}
