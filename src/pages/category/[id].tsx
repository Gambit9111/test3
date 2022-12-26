import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { prisma } from "../../server/db/client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export const getStaticPaths: GetStaticPaths = async () => {
    const data = await prisma.category.findMany();
    const categories = JSON.parse(JSON.stringify(data));
    console.log(categories);

    const paths = categories.map((category: {
        id: number;
    }) => ({
        params: { id: category.id.toString() },
    }));

    return { paths, fallback: false };
}


export const getStaticProps: GetStaticProps = async (context) => {
    const id = context.params?.id;

    const data: any = await prisma.product.findMany({
        where: {
            categoryId: Number(id),
        },
    });

    const products = JSON.parse(JSON.stringify(data));
    console.log(products);

    return {
        props: {
            products,
        },
    };

}

type Props = {
    products: [
        {
            id: number;
            name: string;
            slug: string;
            description: string;
            price: number;
            categoryId: number;
            images: string;
        }
    ];
};



const Category: NextPage<Props> = ({ products }) => {
    return (
        <main className="p-3 min-h-screen flex flex-col md:flex-row items-center justify-evenly gap-2">
            {/* map thru the products */}
            {products && products.map((product) => (
                <Link href={'/product/' + product.slug} key={product.id}><motion.div className="flex flex-col items-center justify-center border-2 border-white rounded-lg"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 1.5, type: "tween" }}
                >
                    <h1 className="text-xs">{product.name}</h1>
                    <Image src={product.images} alt={product.name} width={210} height={280} priority />
                </motion.div>
                </Link>
            ))}
        </main>
    );
};

export default Category;