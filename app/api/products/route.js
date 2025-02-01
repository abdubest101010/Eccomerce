import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const productsWithCategories = await prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    const products = productsWithCategories.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      categoryName: product.category?.name || null,
    }));

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const body = await req.json();
    const { name, description, price, category, stock, imageUrl } = body;

    if (!name || !description || !price || !category || !stock) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    let imageUrlPath = null;

    // Upload the image to Cloudinary if present
    if (imageUrl) {
      const base64Image = imageUrl.split(';base64,').pop();
      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${base64Image}`,
        { folder: 'products' }
      );
      imageUrlPath = result.secure_url;
    }

    // Fetch the category by name
    const categoryRecord = await prisma.category.findUnique({
      where: { name: category },
    });

    if (!categoryRecord) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    // Create a new product
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: categoryRecord.id, // Still store the foreign key
        categoryName: categoryRecord.name, // Store the name for convenience
        stock: parseInt(stock, 10),
        imageUrl: imageUrlPath,
      },
    });
    

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
