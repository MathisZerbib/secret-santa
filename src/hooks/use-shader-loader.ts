import { useState, useEffect } from "react";

const useShaderLoader = (shaderUrl: string) => {
    const [shaderLoaded, setShaderLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = shaderUrl;
        img.onload = () => setShaderLoaded(true);
        img.onerror = () => console.error("Failed to load shader");

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [shaderUrl]);

    return shaderLoaded;
};

export default useShaderLoader;