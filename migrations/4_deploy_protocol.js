var TradeDelegate = artifacts.require("./impl/TradeDelegate");
var BrokerRegistry = artifacts.require("./impl/BrokerRegistry");
var OrderRegistry = artifacts.require("./impl/OrderRegistry");
var RingSubmitter = artifacts.require("./impl/RingSubmitter");
var OrderCanceller = artifacts.require("./impl/OrderCanceller");
var FeeHolder = artifacts.require("./impl/FeeHolder");
var OrderBook = artifacts.require("./impl/OrderBook");
var BurnRateTable = artifacts.require("./impl/BurnRateTable");
var BurnManager = artifacts.require("./impl/BurnManager");
var LRCToken = artifacts.require("./test/tokens/LRC.sol");
var WETHToken = artifacts.require("./test/tokens/WETH.sol");

module.exports = function(deployer, network, accounts) {

  if (network === "live") {
    // ignore.
  } else {
    deployer.then(() => {
      return Promise.all([
        TradeDelegate.deployed(),
        BrokerRegistry.deployed(),
        OrderRegistry.deployed(),
        FeeHolder.deployed(),
        OrderBook.deployed(),
        LRCToken.deployed(),
        WETHToken.deployed(),
      ]);
    }).then(() => {
      return deployer.deploy(BurnRateTable, LRCToken.address, WETHToken.address);
    }).then(() => {
      return Promise.all([
        deployer.deploy(
          RingSubmitter,
          LRCToken.address,
          WETHToken.address,
          TradeDelegate.address,
          BrokerRegistry.address,
          OrderRegistry.address,
          FeeHolder.address,
          OrderBook.address,
          BurnRateTable.address,
        ),
        deployer.deploy(OrderCanceller, TradeDelegate.address),
        deployer.deploy(BurnManager, FeeHolder.address, LRCToken.address),
      ]);
    }).then(() => {
      // do nothing
    });
  }
};
