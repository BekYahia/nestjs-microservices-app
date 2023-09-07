import { INestApplication } from "@nestjs/common";

//export the app instance to use it elsewhere
let app: INestApplication;
const setApp = (_app: INestApplication) => { app = _app}

export { app, setApp }