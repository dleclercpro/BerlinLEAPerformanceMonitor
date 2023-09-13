abstract class Page {
    protected abstract url: string;

    public getUrl() {
        return this.url;
    }
}

export default Page;