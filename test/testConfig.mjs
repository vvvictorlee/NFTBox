//During the automated test the env variable, We will set it to "test"
process.env.NODE_ENV = "test";
process.env.MONGODB_URL = "mongodb://127.0.0.1:27017/nftdb-test";

//Require the dev-dependencies
import  chai from "chai";
import  {should} from "chai";

import chaiHttp from "chai-http";
import  server  from "../server.mjs";
// let should = chai.should();
chai.use(chaiHttp);
import chaiAsPromised  from "chai-as-promised";
chai.use(chaiAsPromised);

//Export this to use in multiple files
// export default chai;
// export  server;
// export  should;
export {
	 chai,
	server,
	 should
};