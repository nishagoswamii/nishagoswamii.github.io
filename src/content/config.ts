
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    // Type-check frontmatter using a schema
    schema: z.object({
        title: z.string(),
        description: z.string(),
        // Transform string to Date object
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: z.string().optional(),
        tags: z.array(z.string()).optional(),
    }),
});

const reviews = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        type: z.enum(['book', 'movie']),
        rating: z.number().min(1).max(5),
        status: z.enum(['reading', 'watching', 'completed', 'dropped', 'plan_to_read', 'plan_to_watch']),
        cover: z.string().optional(),
        author: z.string().optional(),
        director: z.string().optional(),
        pubDate: z.coerce.date(),
    }),
});

export const collections = { blog, reviews };
