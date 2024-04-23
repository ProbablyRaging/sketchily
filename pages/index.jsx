import React from 'react';
import Canvas from '@/components/Canvas';
import Head from 'next/head';

export default function index() {
    return (
        <React.Fragment>
            <Head>
                <title>Sketchily – Real-time collaboration tool</title>

                <meta name="description" content="Draw, sketch, and brainstorm together in real time with our easy-to-use collaborative whiteboard." />
                <meta name="keywords" content="collaborative whiteboard, real-time drawing, Next.js whiteboard, shared canvas, online brainstorming" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="author" content="probablyraging" />

                <meta httpEquiv="content-language" content="en" />

                <meta property="og:title" content="Sketchily – Real-time collaboration tool" />
                <meta property="og:description" content="Draw, sketch, and brainstorm together in real time with our easy-to-use collaborative whiteboard." />
                <meta property="og:url" content="https://sketchily.io" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/sketchily-og.png" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Sketchily – Real-time collaboration tool" />
                <meta name="twitter:description" content="Draw, sketch, and brainstorm together in real time with our easy-to-use collaborative whiteboard." />
                <meta name="twitter:image" content="/sketchily-og.png" />

                <link rel="canonical" href="https://sketchily.io" />
            </Head>

            <Canvas />
        </React.Fragment>
    )
}