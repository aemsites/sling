const POPULAR_DATA_URL = 'https://main--sling--aemsites.aem.page/drafts/fav-popular.json';
async function main() {
    const resp = await fetch(POPULAR_DATA_URL);
    const data = await resp.json();
    const featuredSet = new Set();
    const popularSet = new Set();
    data.data.forEach((row) => {
        if (row.category === 'true') {
            row.featured.split(',').forEach((item) => featuredSet.add(item));
        } else {
            row.popular.split(',').forEach((item) => popularSet.add(item));
        }
    });
}
main();
