import { ScanAPI } from "../../scanapi.mjs";
const apiMgmt = new ScanAPI();
import { UserService } from "../users/user.service.mjs";
const userService = new UserService();
const paused = process.env.PAUSED;
export class NFT {
  // Create and Save a new Note
  gasFeeReport = async (req, res) => {
    console.log("headers = " + JSON.stringify(req.headers)); // 包含了各种header，包括x-forwarded-for(如果被代理过的话)
    console.log("x-forwarded-for = " + req.header("x-forwarded-for")); // 各阶段ip的CSV, 最左侧的是原始ip
    console.log("ips = " + JSON.stringify(req.ips)); // 相当于(req.header('x-forwarded-for') || '').split(',')
    console.log("remoteAddress = " + req.connection.remoteAddress); // 未发生代理时，请求的ip
    console.log("socketremoteAddress = " + req.socket.remoteAddress); // 未发生代理时，请求的ip
    console.log("ip = " + req.ip); // 同req.connection.remoteAddress, 但是格式要好一些
    // const ts = await client.get(req.socket.remoteAddress)
    // console.log("=====ts=========",ts)
    // if (ts==undefined||(new Date().getTime()-ts)>60000){
    //     console.error("The IP does not via geetest or expired  ",req.ip)
    //     // return res.status(400).send({
    //     //     message: "The IP does not via geetest or expired "
    //     // });
    // }

    // // Validate request
    // if (paused) {
    //     return res.status(400).send({
    //         message: "claim  out of service"
    //     });
    // }

    // Validate request
    if (req.body.params.address == undefined || !req.body.params.address) {
      return res.status(400).send({
        message: "address can not be empty",
      });
    }
    let msg = await apiMgmt.getGasFeeReport(req.body.params.address.toLowerCase(),req.body.params.detailtype);
   
    // if (Number(0) != Number(result)) {
    //   return res.send({
    //     code: 10000,
    //     message: msg,
    //   });
    // }

    const json = {
      code: 10000,
      message: "success",
      data: { tokenId: msg },
    };
    res.send(json);
  };

  // Find a single note with a noteId
  interactiveReport = async (req, res) => {
    //console.log(req.body)
    if (!req.body.params.address) {
      return res.status(400).send({
        message: "address can not be empty",
      });
    }

    let msg = await apiMgmt.getInteractiveReport(req.body.params.address.toLowerCase(),req.body.params.detailtype,req.body.params.year);

    // console.log(result, msg);
    // if (Number(0) != Number(result)) {
    //   return res.send({
    //     code: 10000,
    //     message: msg,
    //   });
    // }
    const json = {
      code: 10000,
      message: "success",
      data: {
        tokenId: msg,
      },
    };
    res.send(json);
  };

  // Find a single note with a noteId
  assetReport = async (req, res) => {
    console.log("headers = " + JSON.stringify(req.headers)); // 包含了各种header，包括x-forwarded-for(如果被代理过的话)
    console.log("x-forwarded-for = " + req.header("x-forwarded-for")); // 各阶段ip的CSV, 最左侧的是原始ip
    console.log("ips = " + JSON.stringify(req.ips)); // 相当于(req.header('x-forwarded-for') || '').split(',')
    console.log("remoteAddress = " + req.connection.remoteAddress); // 未发生代理时，请求的ip
    console.log("socketremoteAddress = " + req.socket.remoteAddress); // 未发生代理时，请求的ip
    console.log("ip = " + req.ip); // 同req.connection.remoteAddress, 但是格式要好一些
    const referer = req.header("referer");
    console.log("=====referer=========", referer);
    // if (undefined==referer||-1== referer.indexOf(src_url)){
    //     console.error("unknown source url ",referer)
    //     return res.status(400).send({
    //         message: "unknown source url"
    //     });
    // }
    if (req.body.params.address == undefined || !req.body.params.address) {
      return res.status(400).send({
        message: "address can not be empty",
      });
    }
    // if (req.body.params.ip == undefined || !req.body.params.ip) {
    //     return res.status(400).send({
    //         message: "ip can not be empty"
    //     });
    // }
    // let token = await userService.authenticate(req.body.params);

    let msg = await apiMgmt.getAssetReport(req.body.params.address,req.body.params.year);

    const json = {
      code: 10000,
      message: "success",
      data: {
        flag: msg,
      },
    };
    res.send(json);
  };
}
