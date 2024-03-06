import { useEffect, useRef } from "react";

export function useObjectUrls() {
    //The useRef hook is helpful in React to keep a persistent variable
    //similar to useState, except that changing a ref variable DOES NOT
    //cause a re-render for the app. Aka, it's not directly tied to the visuals
    const mapRef = useRef(null);

    useEffect(() => {
        //Create a map to store the Object URLs inside
        //A map is better here because it can have objects as keys,
        //which a generic object does not allow.
        //Also, the lookup time with a map is O(1), so as fast as possible
        const map = new Map();
        //Set the reference to this map object so that it will persist between re-renders
        mapRef.current = map;

        return () => {
            //Clean up the created Object URLs.
            //This is really the whole point of making this entire custom Hook.
            //Without this a React Component using URL.createObjectURL() would leak memory
            //because every render will make new versions of the URLS and just leave the old ones
            //floating around eating up memory.
            for (const [file, url] of mapRef.current) {
                console.log(`Clearing out ${file.name} from map`);
                URL.revokeObjectURL(url);
            }
            mapRef.current = null;
        }
    //Empty dependency array means it will make 1 map on the first render, then never again
    }, [])

    /**
     * @param {File} file
     * @returns {string | null} A reference to the Object URL for the given file
     */
    return function (file) {
        if (!mapRef.current || !file) {
            return null;
        }

        if (!mapRef.current.has(file)) {
            mapRef.current.set(file, URL.createObjectURL(file));
        }

        return mapRef.current.get(file);
    }
}