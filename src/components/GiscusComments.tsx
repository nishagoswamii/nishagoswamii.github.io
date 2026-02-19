import { useEffect, useState } from 'react';

export default function GiscusComments() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Function to get current theme
        const getTheme = () => {
            return document.documentElement.classList.contains('dark')
                ? 'noborder_dark'
                : 'light';
        };

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
        script.setAttribute('data-theme', getTheme());
        script.setAttribute('data-lang', 'en');
        script.crossOrigin = 'anonymous';
        script.async = true;

        const commentsDiv = document.getElementById('giscus-comments');
        if (commentsDiv) {
            commentsDiv.innerHTML = '';
            commentsDiv.appendChild(script);
        }

        // Observer for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type === 'attributes' &&
                    mutation.attributeName === 'class'
                ) {
                    const iframe = document.querySelector<HTMLIFrameElement>(
                        'iframe.giscus-frame'
                    );
                    if (!iframe) return;

                    const theme = getTheme();
                    iframe.contentWindow?.postMessage(
                        { giscus: { setConfig: { theme } } },
                        'https://giscus.app'
                    );
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => {
            observer.disconnect();
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div className="w-full mt-10">
            <div id="giscus-comments" />
        </div>
    );
}
