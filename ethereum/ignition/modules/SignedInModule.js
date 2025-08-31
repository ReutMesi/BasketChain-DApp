const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SignedInModule", (m) => {
  const basketToken = m.contract("BasketToken", []);

  const teamFactory = m.contract("TeamFactory", [basketToken]);

  const playerFactory = m.contract("PlayerNFTFactory", []);

  return { basketToken, teamFactory, playerFactory };
});
