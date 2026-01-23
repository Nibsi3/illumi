declare module "ua-parser-js" {
  type UAParserResult = {
    ua?: string
    browser?: { name?: string; version?: string; major?: string }
    engine?: { name?: string; version?: string }
    os?: { name?: string; version?: string }
    device?: { vendor?: string; model?: string; type?: string }
    cpu?: { architecture?: string }
  }

  export default class UAParser {
    constructor(ua?: string)
    setUA(ua: string): this
    getUA(): string
    getResult(): UAParserResult
    getBrowser(): UAParserResult["browser"]
    getEngine(): UAParserResult["engine"]
    getOS(): UAParserResult["os"]
    getDevice(): UAParserResult["device"]
    getCPU(): UAParserResult["cpu"]
  }
}
