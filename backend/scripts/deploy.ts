import hre from 'hardhat'
const { ethers } = hre
import * as fs from 'fs'
import * as path from 'path'

async function main() {
  console.log('Deploying SupplyChain contract...')

  const [deployer] = await ethers.getSigners()
  console.log('Deploying with account:', deployer.address)
  
  const balance = await ethers.provider.getBalance(deployer.address)
  console.log('Account balance:', ethers.formatEther(balance), 'ETH')

  if (balance === 0n) {
    throw new Error('Account has no funds. Please fund the account or use a different account.')
  }

  const SupplyChain = await ethers.getContractFactory('SupplyChain')
  const supplyChain = await SupplyChain.deploy()

  await supplyChain.waitForDeployment()

  const address = await supplyChain.getAddress()
  const network = await ethers.provider.getNetwork()
  const chainId = network.chainId.toString()

  console.log('SupplyChain deployed to:', address)
  console.log('Network chain ID:', chainId)

  const deploymentsPath = path.join(__dirname, '../../client/src/deployments.json')
  
  const dirPath = path.dirname(deploymentsPath)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  let deployments = { networks: {} as any }
  
  if (fs.existsSync(deploymentsPath)) {
    try {
      const fileContent = fs.readFileSync(deploymentsPath, 'utf8')
      deployments = fileContent ? JSON.parse(fileContent) : { networks: {} }
    } catch (error) {
      console.log('Warning: Could not parse existing deployments.json, starting fresh.')
      deployments = { networks: {} }
    }
  }

  if (!deployments.networks) deployments.networks = {}
  if (!deployments.networks[chainId]) deployments.networks[chainId] = {}

  deployments.networks[chainId].SupplyChain = {
    address: address,
  }

  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2))
  console.log('Deployment info saved to client/src/deployments.json')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })