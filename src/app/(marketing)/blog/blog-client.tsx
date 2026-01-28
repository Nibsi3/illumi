"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

type BlogPost = {
    title: string
    excerpt: string
    author: string
    date: string
    readTime: string
    category: string
    href: string
}

export default function BlogClient({
    posts,
    categories,
}: {
    posts: BlogPost[]
    categories: string[]
}) {
    const [activeCategory, setActiveCategory] = useState("All")

    const filteredPosts = useMemo(() => {
        const visible = activeCategory === "All"
            ? posts
            : posts.filter((p) => p.category === activeCategory)

        return [...visible].sort((a, b) => {
            const aIsComparison = a.category === "Comparison" ? 1 : 0
            const bIsComparison = b.category === "Comparison" ? 1 : 0
            return bIsComparison - aIsComparison
        })
    }, [activeCategory, posts])

    return (
        <>
            <section className="py-6 px-6 border-b border-border">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => {
                            const isActive = cat === activeCategory
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {cat}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="py-8 px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col gap-1 mb-8">
                        <h2 className="text-2xl font-bold">Latest Articles</h2>
                        <p className="text-sm text-muted-foreground">
                            {activeCategory === "All" ? "All posts" : `Filtered: ${activeCategory}`}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <Link key={post.title} href={post.href} className="group">
                                <article className="rounded-xl border border-border bg-card p-6 h-full hover:border-primary/50 transition-colors">
                                    <div className="px-2 py-0.5 rounded bg-muted text-xs font-medium text-muted-foreground w-fit mb-4">
                                        {post.category}
                                    </div>
                                    <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
                                        <span>{post.date}</span>
                                        <span>•</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
