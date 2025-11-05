'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Folder, FileText, Video, MicVocal } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

// Placeholder data - this would come from Firestore
const resources = [
    { id: 1, title: "React Best Practices", category: "Guides", domain: "web-dev", url: "#", type: 'article' },
    { id: 2, title: "Understanding React Hooks", category: "Videos", domain: "web-dev", url: "#", type: 'video' },
    { id: 3, title: "Building a REST API with Node.js", category: "Guides", domain: "web-dev", url: "#", type: 'article' },
    { id: 4, title: "Intro to TensorFlow", category: "Videos", domain: "ai-ml", url: "#", type: 'video' },
    { id: 5, title: "Data Cleaning with Pandas", category: "Guides", domain: "data-science", url: "#", type: 'article' },
    { id: 6, title: "Machine Learning Roadmap", category: "Roadmaps", domain: "ai-ml", url: "#", type: 'article' },
    { id: 7, title: "System Design Basics", category: "Videos", domain: "web-dev", url: "#", type: 'video' },
    { id: 8, title: "Product Management 101", category: "Podcasts", domain: "product-management", url: "#", type: 'podcast' },
];

// Placeholder - this would come from the authenticated user's profile
const userDomains = ["web-dev", "ai-ml"];

const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'video': return <Video className="h-4 w-4 text-muted-foreground" />;
        case 'podcast': return <MicVocal className="h-4 w-4 text-muted-foreground" />;
        default: return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
}

export default function ResourcesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDomain, setActiveDomain] = useState(userDomains[0]);

    const filteredResources = resources
        .filter(r => r.domain === activeDomain)
        .filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const categories = [...new Set(filteredResources.map(r => r.category))];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Resource Library</h1>
                <p className="text-muted-foreground">Curated content to help you excel.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <Input 
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <div className="flex items-center gap-2">
                    {userDomains.map(domain => (
                        <Badge 
                            key={domain} 
                            variant={activeDomain === domain ? 'default' : 'secondary'}
                            onClick={() => setActiveDomain(domain)}
                            className="cursor-pointer"
                        >
                            {domain}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                {categories.map(category => (
                    <div key={category}>
                        <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
                           <Folder className="h-6 w-6 text-primary" />
                           <span>{category}</span>
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                        {filteredResources.filter(r => r.category === category).map(resource => (
                            <a key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg border bg-card hover:bg-muted transition-colors">
                                <div className="flex items-center gap-3">
                                    <TypeIcon type={resource.type} />
                                    <span className="font-medium">{resource.title}</span>
                                </div>
                            </a>
                        ))}
                        </div>
                    </div>
                ))}
                {filteredResources.length === 0 && (
                    <Card className="flex flex-col items-center justify-center p-12">
                        <CardHeader>
                            <CardTitle>No Resources Found</CardTitle>
                            <CardDescription>Try a different search term or domain.</CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </div>
    );
}
