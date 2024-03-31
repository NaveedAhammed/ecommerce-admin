export type ImageType = {
	url: string;
	_id: string;
};

export type ParentCategoryType = {
	_id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
};

export type ChildCategoryType = {
	_id: string;
	parentCategory: ParentCategoryType;
	name: string;
	createdAt: string;
	updatedAt: string;
};

export type BillboardType = {
	_id: string;
	title: string;
	imageUrl?: string;
	category: ParentCategoryType;
	createdAt: string;
	updatedAt: string;
};

export type ColorType = {
	_id: string;
	name: string;
	value: string;
	createdAt: string;
	updatedAt: string;
};

export type UnitType = {
	_id: string;
	name: string;
	value: string;
	shortHand?: string;
	createdAt: string;
	updatedAt: string;
};

export type ProductType = {
	_id: string;
	title: string;
	description: string;
	brand: string;
	price: number | string;
	discount: number | string;
	stock: number | string;
	images: ImageType[];
	parentCategory: ParentCategoryType;
	category: ChildCategoryType;
	color: ColorType;
	unit: UnitType;
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
