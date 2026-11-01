import { useEffect, useState } from 'react';

export default function GiscusComments() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Initialize Giscus
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.setAttribute('data-repo', 'nishagoswamii/nishagoswamii.github.io');
        script.setAttribute('data-repo-id', 'R_kgDOPcKT3w');
        script.setAttribute('data-category', 'General');
        script.setAttribute('data-category-id', 'DIC_kwDOPcKT384C2oI3');
        script.setAttribute('data-mapping', 'pathname');
        script.setAttribute('data-strict', '1');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'bottom');
        script.setAttribute('data-theme', 'light');
        script.setAttribute('data-lang', 'en');
        script.crossOrigin = 'anonymous';
        script.async = true;

        const commentsDiv = document.getElementById('giscus-comments');
        if (commentsDiv) {
            commentsDiv.innerHTML = '';
            commentsDiv.appendChild(script);
        }
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div className="w-full mt-10">
            <div id="giscus-comments" />
        </div>
    );
}
