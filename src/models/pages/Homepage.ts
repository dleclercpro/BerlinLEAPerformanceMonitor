import { BERLIN_LEA_HOMEPAGE_URL } from '../../constants';
import Page from './Page';

class Homepage extends Page {
    private static instance: Homepage;

    protected url: string = BERLIN_LEA_HOMEPAGE_URL;

    private constructor() {
        super();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Homepage();
        }

        return this.instance;
    }
}

export default Homepage.getInstance();