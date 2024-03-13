export type ImageType = {
  url: string;
  _id: string;
};

export type CategoryType = {
  name: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type ColorType = {
  name: string;
  value: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type SizeType = {
  name: string;
  value: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductType = {
  _id: string;
  title: string;
  description: string;
  price: number | string;
  discount: number | string;
  stock: number | string;
  images: ImageType[];
  category: CategoryType;
  color: ColorType;
  size: SizeType;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminType = {
  username: string;
  avatar?: string | undefined;
  accessToken: string;
  id: string;
};
