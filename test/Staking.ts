import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("Staking", function (){

    async function deployToken() {
        // deploy the token First
        const [owner, otherAccount] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Timidan");
        const token = await Token.deploy(owner.address);
        await token.deployed()
        // deploy the staking
        const Staking = await ethers.getContractFactory("Staking");
        const staking = await Staking.deploy(token.address);
        await staking.deployed()

        const tokenAddress = token.address;
        const stakingAddress = staking.address;;
        const tokenSupply = await ethers.utils.parseEther("100000")

        return {token, staking, tokenAddress, stakingAddress, owner, otherAccount, tokenSupply}

    }

    describe("Balance on Deployment", function () {
        it("Should check the contract balance is zero", async function () {
            const {token, staking} = await loadFixture(deployToken);

            expect(await token.balanceOf(staking.address)).to.equal(0)
        })
        it("Should check the deployer balance is 100000e18", async function () {
            const {token, owner, tokenSupply} = await loadFixture(deployToken);

            expect(await token.balanceOf(owner.address)).to.equal(tokenSupply);
        })
    })

    describe("Send Token to a contract and other account", async function (){
        it("Should send token to a contract", async function () {
            const {token, owner, staking} = await loadFixture(deployToken);
            const amountToSend = await ethers.utils.parseEther("50000")

            await token.transfer(staking.address, amountToSend)
            expect(await token.balanceOf(staking.address)).to.equal(amountToSend);
            expect(await token.balanceOf(owner.address)).to.equal(amountToSend);
        })

    })
})