const isValidImageUrl = (url: string | undefined | null): boolean => {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return url.startsWith('/') && /\.(jpg|jpeg|png|gif|webp)$/.test(url);
    }
}

const getImageSrc = (pic: string | undefined | null): string => {
    if (isValidImageUrl(pic)) {
        return pic!;
    }
    if (pic) {
        console.log(`Invalid image URL detected: ${pic}. Falling back to default avatar`);

    }

    return '/avatar.png';

}

export { getImageSrc }