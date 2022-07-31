import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

import prisma from "../../lib/prisma";

export type SuccessfulResponse<T> = {
  data: T;
  error?: never;
  statusCode?: number;
};
export type UnsuccessfulResponse<E> = {
  data?: never;
  error: E;
  statusCode?: number;
};

export type ApiResponse<T, E = unknown> =
  | SuccessfulResponse<T>
  | UnsuccessfulResponse<E>;

interface NextConnectApiRequest extends NextApiRequest {
  files: Express.Multer.File[];
}
type ResponseData = ApiResponse<string>;

const oneMegabyteInBytes = 1000000;
const outputFolderName = "./public/uploads";

const upload = multer({
  limits: { fileSize: oneMegabyteInBytes * 2 },
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}.${file.mimetype.split("/")[1]}`);
    },
  }),
  /*fileFilter: (req, file, cb) => {
    const acceptFile: boolean = ['image/jpeg', 'image/png'].includes(file.mimetype);

    cb(null, acceptFile);
  },*/
});

const apiRoute = nextConnect({
  onError(
    error,
    req: NextConnectApiRequest,
    res: NextApiResponse<ResponseData>
  ) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array("theFiles"));

apiRoute.post(
  async (req: NextConnectApiRequest, res: NextApiResponse<ResponseData>) => {
    const obj = JSON.parse(JSON.stringify(req.body));

    const file = Array.isArray(obj?.file)
      ? obj.file.map((file) => JSON.parse(file))
      : [JSON.parse(obj.file)];

    const products = req.files.map((product) => {
      return {
        filename: product.filename,
        price: Math.random(),
        name: file.find(
          (productFile) => productFile.originalname === product.originalname
        ).productName,
      };
    });

    // create products in postgres
    await prisma.product.createMany({
      data: products,
    });

    res.status(200).json({ data: "success upload of products" });
  }
);

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
export default apiRoute;
