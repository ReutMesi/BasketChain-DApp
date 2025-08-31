const { expect } = require("chai");

describe("TeamFactory and TeamManager", function () {
  let basketToken;
  let teamFactory;
  let teamManager;
  let playerFactory;
  let nftAddress;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy BasketToken
    const BasketToken = await ethers.getContractFactory("BasketToken");
    basketToken = await BasketToken.deploy();
    await basketToken.waitForDeployment();

    // Deploy TeamFactory with token address
    const TeamFactory = await ethers.getContractFactory("TeamFactory");
    teamFactory = await TeamFactory.deploy(await basketToken.getAddress());
    await teamFactory.waitForDeployment();

    // Give TeamFactory enough tokens to create teams
    const amount = ethers.parseEther("100000");
    await basketToken.transfer(await teamFactory.getAddress(), amount);

    // Create a new TeamManager from factory
    await teamFactory.createTeam();
    const teams = await teamFactory.getTeams();
    const TeamManager = await ethers.getContractFactory("TeamManager");
    teamManager = await TeamManager.attach(teams[0]);

    // Deploy PlayerNFTFactory and create a real PlayerNFT
    const PlayerFactory = await ethers.getContractFactory("PlayerNFTFactory");
    playerFactory = await PlayerFactory.deploy();
    await playerFactory.waitForDeployment();

    await playerFactory.createPlayerNFT(
      "PlayerNFT", "PNFT",
      "Reut", 23, 180, 1000,
      "ipfs://image", "https://highlight.url"
    );

    const nftAddresses = await playerFactory.getAllNFTs();
    nftAddress = nftAddresses[0]; // Use this for the teamManager requests
  });

  it("should deploy BasketToken and TeamFactory", async function () {
    expect(await basketToken.name()).to.equal("BasketToken");
    expect(await teamFactory.tokenAddress()).to.equal(await basketToken.getAddress());
  });

  it("should create a team and transfer initial tokens", async function () {
    const teamAddress = (await teamFactory.getTeams())[0];
    const balance = await basketToken.balanceOf(teamAddress);
    expect(balance).to.equal(100_000n * 10n ** 18n);
  });

  it("should allow someone to join the board with ETH", async function () {
    await teamManager.connect(addr1).joinBoard({ value: ethers.parseEther("0.2") });
    const isMember = await teamManager.isBoardMember(addr1.address);
    expect(isMember).to.be.true;
  });

  it("should allow the admin to create a signing request", async function () {
    await teamManager.createRequest("Sign Player X", nftAddress);
    expect(await teamManager.getRequestsCount()).to.equal(1);
  });

  it("should allow a board member to approve a request", async function () {
    await teamManager.connect(addr1).joinBoard({ value: ethers.parseEther("0.2") });

    await teamManager.createRequest("Sign Player Y", nftAddress);
    await teamManager.connect(addr1).approveRequest(0);
    // no revert = passed
  });

  it("should reject approval from non-board member", async function () {
    await teamManager.createRequest("Sign Player Z", nftAddress);

    await expect(teamManager.connect(addr2).approveRequest(0)).to.be.revertedWith("Not a board member");
  });

  it("should reject duplicate board join", async function () {
    await teamManager.connect(addr1).joinBoard({ value: ethers.parseEther("0.2") });
    await expect(
      teamManager.connect(addr1).joinBoard({ value: ethers.parseEther("0.2") })
    ).to.be.revertedWith("Already on board");
  });

  it("should reject joining board with too little ETH", async function () {
  // שליחת פחות מהמינימום החדש
  await expect(
    teamManager.connect(addr1).joinBoard({ value: ethers.parseEther("0.00000009") })
  ).to.be.revertedWith("Minimum 0.0000001 ETH required");
});
});
