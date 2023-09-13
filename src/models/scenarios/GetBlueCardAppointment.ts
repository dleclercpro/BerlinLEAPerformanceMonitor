import Bot from '../Bot';
import Homepage from '../pages/Homepage';
import Scenario from './Scenario';

class GetBlueCardAppointment extends Scenario {
    private static instance: GetBlueCardAppointment;

    protected name: string = 'GetBlueCardAppointment';

    private constructor() {
        super();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new GetBlueCardAppointment();
        }

        return this.instance;
    }

    protected async doExecute(bot: Bot) {
        await bot.visitPage(Homepage);
    }
}

export default GetBlueCardAppointment.getInstance();