const PredictionMessage = artifacts.require("PredictionMessage");
const MyPrediction = artifacts.require("MyPrediction");

module.exports = function(deployer) {
    deployer.deploy(PredictionMessage);
    deployer.deploy(MyPrediction);
};
