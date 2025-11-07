import React from 'react';
import { Helmet } from 'react-helmet';

interface PersonSchema {
  name: string;
  jobTitle: string;
  url: string;
  image?: string;
  description?: string;
  sameAs?: string[];
}

interface ProjectSchema {
  name: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  author?: {
    name: string;
    url: string;
  };
  keywords?: string[];
}

interface BlogPostSchema {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url: string;
  };
  publisher: {
    name: string;
    logo: {
      url: string;
    };
  };
  mainEntityOfPage: string;
  keywords?: string[];
}

export const PersonStructuredData: React.FC<{ person: PersonSchema }> = ({ person }) => {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.jobTitle,
    url: person.url,
    ...(person.image && { image: person.image }),
    ...(person.description && { description: person.description }),
    ...(person.sameAs && { sameAs: person.sameAs })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
    </Helmet>
  );
};

export const ProjectStructuredData: React.FC<{ project: ProjectSchema }> = ({ project }) => {
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.name,
    description: project.description,
    url: project.url,
    ...(project.image && { image: project.image }),
    ...(project.datePublished && { datePublished: project.datePublished }),
    ...(project.author && { author: {
      '@type': 'Person',
      name: project.author.name,
      url: project.author.url
    }}),
    ...(project.keywords && { keywords: project.keywords.join(', ') }),
    applicationCategory: 'WebApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/OnlineOnly'
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(projectSchema)}
      </script>
    </Helmet>
  );
};

export const BlogPostStructuredData: React.FC<{ blogPost: BlogPostSchema }> = ({ blogPost }) => {
  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blogPost.headline,
    description: blogPost.description,
    image: blogPost.image,
    datePublished: blogPost.datePublished,
    dateModified: blogPost.dateModified || blogPost.datePublished,
    author: {
      '@type': 'Person',
      name: blogPost.author.name,
      url: blogPost.author.url
    },
    publisher: {
      '@type': 'Organization',
      name: blogPost.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: blogPost.publisher.logo.url
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blogPost.mainEntityOfPage
    },
    ...(blogPost.keywords && { keywords: blogPost.keywords.join(', ') })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(blogPostSchema)}
      </script>
    </Helmet>
  );
};