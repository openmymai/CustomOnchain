import web3 from '@solana/web3.js';
import * as dotenv from 'dotenv';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';

const CLUSTER_NAME = 'devnet';

const PING_PROGRAM_ADDRESS = new web3.PublicKey(
  'ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa'
);
const PING_PROGRAM_DATA_ADDRESS = new web3.PublicKey(
  'Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod'
);

dotenv.config();

const payer = getKeypairFromEnvironment('SECRET_KEY');
console.log(`🔑 Loaded keypair ${payer.publicKey.toBase58()}!`);

const connection = new web3.Connection(web3.clusterApiUrl(CLUSTER_NAME));
console.log(`⚡️ Connected to Solana ${CLUSTER_NAME} cluster!`);

await connection.requestAirdrop(payer.publicKey, web3.LAMPORTS_PER_SOL * 1);
console.log(`💸 Got some ${CLUSTER_NAME} lamports!`);

const transaction = new web3.Transaction();

const programId = new web3.PublicKey(PING_PROGRAM_ADDRESS);
const pringProgramDataId = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS);

const instruction = new web3.TransactionInstruction({
  keys: [
    {
      pubkey: pringProgramDataId,
      isSigner: false,
      isWritable: true,
    },
  ],
  programId,
});

transaction.add(instruction);

const signature = await web3.sendAndConfirmTransaction(
  connection,
  transaction,
  [payer]
);

console.log(
  `✅ Transaction completed! You can view your transaction on the Solana Explorer at:`
);
console.log(
  `https://explorer.solana.com/tx/${signature}?cluster=${CLUSTER_NAME}`
);
