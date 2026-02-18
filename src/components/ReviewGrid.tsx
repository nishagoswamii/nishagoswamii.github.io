import React from 'react';
import { Star, BookOpen, Film } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Review {
    id: string;
    data: {
        title: string;
        type: 'book' | 'movie';
        rating: number;
        status: 'reading' | 'watching' | 'completed' | 'dropped' | 'plan_to_read' | 'plan_to_watch';
        cover?: string;
        author?: string;
        director?: string;
        pubDate: Date;
    };
    body: string;
}

interface ReviewGridProps {
    reviews: Review[];
    title: string;
}

const ReviewGrid: React.FC<ReviewGridProps> = ({ reviews, title }) => {
    if (reviews.length === 0) return null;

    return (
        <div className="py-8">
            <h2 className="text-3xl font-heading font-bold mb-6 flex items-center gap-3">
                {title === "Books Shelf" ? <BookOpen className="w-8 h-8 text-primary" /> : <Film className="w-8 h-8 text-primary" />}
                {title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                    <Card key={review.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm border-border/50">
                        <CardContent className="p-0 flex flex-col h-full">
                            <div className="relative h-48 overflow-hidden group">
                                {review.data.cover ? (
                                    <img
                                        src={review.data.cover}
                                        alt={review.data.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                                        {review.data.type === 'book' ? <BookOpen className="w-12 h-12 text-muted-foreground" /> : <Film className="w-12 h-12 text-muted-foreground" />}
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <Badge variant={review.data.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
                                        {review.data.status.replace(/_/g, ' ')}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-heading font-bold text-lg leading-tight mb-1">{review.data.title}</h3>
                                        <p className="text-sm text-muted-foreground">{review.data.author || review.data.director}</p>
                                    </div>
                                    <div className="flex items-center bg-yellow-500/10 px-2 py-1 rounded text-yellow-500">
                                        <Star className="w-3 h-3 fill-current mr-1" />
                                        <span className="text-xs font-bold">{review.data.rating}</span>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-3 mt-2 flex-1">
                                    {review.body}
                                </p>

                                <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                                    <span>{new Date(review.data.pubDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ReviewGrid;
