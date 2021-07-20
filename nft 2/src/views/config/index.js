const mainChainId = "0x46";
const endpoint = "https://http-mainnet.hoosmartchain.com";
const testChainId = "0xaa";
const testEndpoint = "https://http-testnet.hoosmartchain.com";
export const switchToHSC = {
    chainId: mainChainId,
    chainName: "HSC_MAIN",
    rpcUrls: [endpoint],
    nativeCurrency: {
      name: "HOO MAIN",
      symbol: "HOO",
      decimals: 18
    },
    blockExplorerUrls: [
      "https://www.hscscan.com/?network=HSC_MAIN&rpcUrl=" + endpoint
    ]
};
export const switchToTestHSC = {
    chainId: testChainId,
    chainName: "HSC_TEST_MAIN",
    rpcUrls: [testEndpoint],
    nativeCurrency: {
      name: "HOO TEST MAIN",
      symbol: "HOO",
      decimals: 18
    },
    blockExplorerUrls: [
      "https://www.hscscan.com/?network=HSC_TEST_MAIN&rpcUrl=" + testEndpoint
    ]
};