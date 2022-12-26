import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { prisma } from "../../server/db/client";
import Image from "next/image";
import { motion } from "framer-motion";

export const getStaticPaths: GetStaticPaths = async () => {
    const data = await prisma.product.findMany();
    const products = JSON.parse(JSON.stringify(data));
    console.log(products);

    const paths = products.map((product: {
        slug: string;
    }) => ({
        params: { slug: product.slug },
    }));

    return { paths, fallback: false };
}


export const getStaticProps: GetStaticProps = async (context) => {
    const slug = context.params?.slug;

    const data: any = await prisma.product.findUnique({
        where: {
            slug: String(slug),
        },
    });

    const product = JSON.parse(JSON.stringify(data));
    console.log(product);

    return {
        props: {
            product,
        },
    };

}

type Props = {
    product: {
        id: number;
        name: string;
        slug: string;
        description: string;
        price: number;
        categoryId: number;
        images: string;
    }
};



const Category: NextPage<Props> = ({ product }) => {
    return (
        <main className="min-h-screen flex-col p-3">
            <div className="border-2 border-white h-full rounded-lg">
                <Image src={product.images} alt={product.name} width={420} height={560} />
                <div className="flex flex-col">
                    <div className="w-full h-[2px] bg-white mb-3" />
                    <h1 className="text-sm tracking-widest uppercase font-bold mb-3 border-b w-8/12 mx-auto text-center">{product.name}</h1>
                    <h1 className="text-sm tracking-wider leading-5 text-center">{product.description}</h1>
                </div>
            </div>
            <h1 className="text-4xl font-semibold text-center mt-3 border-b w-3/12 mx-auto">{product.price}€</h1>
        </main>
    );
};

export default Category;