const PredictionMessage = artifacts.require("PredictionMessage");

module.exports = function(deployer) {
    deployer.deploy(PredictionMessage);
};
