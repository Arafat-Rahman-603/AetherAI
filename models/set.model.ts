import { Schema, model, models } from "mongoose";

interface IProduct {
  name: string;
  price: string | number;
}

interface IProducts {
  data: IProduct[];
  lastUpdated: number;
}

interface ISet {
  userId: string;
  business: string;
  email: string;
  backendUrl: string;
  data: string;
  products?: IProducts;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Schema.Types.Mixed, required: true },
});

const ProductsSchema = new Schema<IProducts>({
  data: [ProductSchema],
  lastUpdated: { type: Number, required: true },
});

const setSchema = new Schema<ISet>(
  {
    userId: { type: String, required: true, unique: true },
    business: { type: String },
    email: { type: String },
    backendUrl: { type: String },
    data: { type: String },
    products: { type: ProductsSchema, default: null },
  },
  { timestamps: true }
);

const Set = models.Set || model("Set", setSchema);

export default Set;