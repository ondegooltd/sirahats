"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function InspirationPage() {
  const inspirationPosts = [
    {
      id: 1,
      title: "5 Ways to Style Storage Baskets in Your Living Room",
      excerpt:
        "Transform your living space with these creative styling tips using our handwoven storage baskets.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Home Styling",
      readTime: "3 min read",
      date: "March 15, 2024",
    },
    {
      id: 2,
      title: "The Art of African Basket Weaving: A Cultural Journey",
      excerpt:
        "Discover the rich history and cultural significance behind the traditional weaving techniques used in our baskets.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Culture",
      readTime: "5 min read",
      date: "March 10, 2024",
    },
    {
      id: 3,
      title: "Creating a Sustainable Home with Natural Materials",
      excerpt:
        "Learn how incorporating natural, handcrafted items like our baskets can make your home more eco-friendly.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Sustainability",
      readTime: "4 min read",
      date: "March 5, 2024",
    },
    {
      id: 4,
      title: "Wall Basket Gallery: Creative Display Ideas",
      excerpt:
        "Turn your walls into art with these stunning wall basket arrangement ideas and styling tips.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Home Styling",
      readTime: "3 min read",
      date: "February 28, 2024",
    },
    {
      id: 5,
      title: "Meet the Artisans: Stories from Ghana",
      excerpt:
        "Get to know the talented weavers behind our beautiful baskets and learn about their craft traditions.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Artisans",
      readTime: "6 min read",
      date: "February 20, 2024",
    },
    {
      id: 6,
      title: "Organizing Your Home Office with Style",
      excerpt:
        "Discover how our functional baskets can help you create an organized and beautiful workspace.",
      image: "/placeholder.svg?height=300&width=400",
      category: "Organization",
      readTime: "4 min read",
      date: "February 15, 2024",
    },
  ];

  const categories = [
    "All",
    "Home Styling",
    "Culture",
    "Sustainability",
    "Artisans",
    "Organization",
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Inspiration & Stories
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover styling tips, cultural stories, and sustainable living
              ideas to inspire your home and lifestyle.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full font-medium transition-colors duration-200 bg-gray-100 text-gray-700 hover:bg-[#8BC34A] hover:text-white"
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Featured Post */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <div className="relative h-96 rounded-lg overflow-hidden mb-6">
              <Image
                src="/placeholder.svg?height=400&width=800"
                alt="Featured post"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <span className="inline-block bg-[#8BC34A] px-3 py-1 rounded-full text-sm font-medium mb-3">
                  Featured
                </span>
                <h2 className="text-3xl font-bold mb-3">
                  The Art of African Basket Weaving: A Cultural Journey
                </h2>
                <p className="text-lg mb-4 opacity-90">
                  Discover the rich history and cultural significance behind the
                  traditional weaving techniques used in our baskets.
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span>Culture</span>
                  <span>•</span>
                  <span>5 min read</span>
                  <span>•</span>
                  <span>March 10, 2024</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {inspirationPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-[#8BC34A] bg-opacity-10 text-[#8BC34A] px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[#8BC34A] transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <Link
                      href={`/inspiration/${post.id}`}
                      className="text-[#8BC34A] font-medium hover:text-[#689F38] transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 bg-[#8BC34A] text-white p-8 rounded-lg text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Stay Inspired</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Get the latest styling tips, artisan stories, and sustainable
              living ideas delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="bg-white text-[#8BC34A] px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
