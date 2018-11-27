declare const MODE : string;

class AppService {

    public isDEBUG : boolean = (MODE === 'development');

}

const appService = new AppService();

export {
    appService
};
