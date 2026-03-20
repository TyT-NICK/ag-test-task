export type ProductListItem = {
  id: number;
  title: string;
  category: string;
  brand?: string;
  sku: string;
  rating: number;
  price: number;
  discountPercentage: number;
  thumbnail: string;
};

export type Product = ProductListItem & {
  description: string;
  discountPercentage: number;
  stock: number;
  availabilityStatus: string;
  tags: string[];
  images: string[];
  warrantyInformation: string;
  shippingInformation: string;
  returnPolicy: string;
  weight: number;
};

export type ProductsResponse = {
  products: ProductListItem[];
  total: number;
  skip: number;
  limit: number;
};
