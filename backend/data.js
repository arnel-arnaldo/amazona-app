import bcrypt from 'bcryptjs';

const data = {
    users: [
        {
            name: 'Arnel Arnaldo',
            email: 'arnelarnaldo@arnold-hayes.com',
            password: bcrypt.hashSync('1234', 8),
            isAdmin: true,
            isSeller: true,
            seller: {
                name: "Arnold-Hayes",
                logo: '/images/logoexample.jpg',
                description: "Arnold-Hayes Business Enterprise",
                rating: 4.0,
                numReviews: 120
            }
        },
        {
            name: 'Hazel Arnaldo',
            email: 'hazelarnaldo@arnold-hayes.com',
            password: bcrypt.hashSync('1234', 8),
            isAdmin: true,
            seller: {
                name: "Arnold-Hayes",
                logo: '/images/logoexample.jpg',
                description: "Arnold-Hayes Business Enterprise",
                rating: 5.0,
                numReviews: 120
            }
        }
    ],
    products: [
        {
            name: 'Nike Slim Shirt',
            category: 'Shirts',
            image: '/images/p1.jpg',
            price: 120,
            countInStock: 10,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 10,
            description: 'High quality Nike product',
        },
        {
            name: 'Adidas Fit Shirt',
            category: 'Shirts',
            image: '/images/p2.jpg',
            price: 100,
            countInStock: 20,
            brand: 'Adidas',
            rating: 4.0,
            numReviews: 10,
            description: 'High quality Adidas product',
        },
        {
            name: 'Lacoste Free Shirt',
            category: 'Shirts',
            image: '/images/p3.jpg',
            price: 220,
            countInStock: 0,
            brand: 'Lacoste',
            rating: 4.8,
            numReviews: 17,
            description: 'High quality Lacoste product',
        },
        {
            name: 'Nike Slim Pants',
            category: 'Pants',
            image: '/images/p4.jpg',
            price: 78,
            countInStock: 50,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 14,
            description: 'High quality Nike product',
        },
        {
            name: 'Puma Slim Pants',
            category: 'Pants',
            image: '/images/p5.jpg',
            price: 65,
            countInStock: 5,
            brand: 'Puma',
            rating: 4.5,
            numReviews: 10,
            description: 'High quality Puma product',
        },
        {
            name: 'Elegant Senior Pants',
            category: 'Pants',
            image: '/images/p6.jpg',
            price: 139,
            countInStock: 12,
            brand: 'Elegant Tailoring',
            rating: 4.5,
            numReviews: 15,
            description: 'High quality Elegant Tailoring product',
        }
    ]
}

export default data;