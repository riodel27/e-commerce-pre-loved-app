import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../lib/prisma";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await prisma.product.create({
    data: {
      name: "",
      price: 2222,
      filename: "",
    },
  });

  res.status(200).json({ name: "Success creation of product" });
}
