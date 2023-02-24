const anchor = require('@project-serum/anchor');
const solanaWeb3 = require("@solana/web3.js")
import { PublicKey } from "@solana/web3.js";
import {SolanaConfigService} from "@coin98/solana-support-library/config"
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, getAccount } from '@solana/spl-token';
const { SystemProgram } = anchor.web3;


let wallet = anchor.web3.Keypair.generate();
const connection = new solanaWeb3.Connection("http://127.0.0.1:8899", 'confirmed');
import {
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
before(async () => {
  wallet = await SolanaConfigService.getDefaultAccount()
  console.log(wallet.publicKey.toString())
})
describe('implement' ,() => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Vd1;

  it("swap" , async () => {
    //Create token x
    const mint_x = await createMint(
      connection,
      wallet,
      wallet.publicKey,
      wallet.publicKey,
      0
    );
    console.log("mintAccount_x:" , mint_x)

    //Create token account x
    const tokenAccount_x = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mint_x,
      wallet.publicKey
    )
    console.log("tokenAccount_x" , tokenAccount_x.address.toBase58())

    //Mint token x for user
    await mintTo(
      connection,
      wallet,
      mint_x,
      tokenAccount_x.address,
      wallet,
      new anchor.BN(100)
    )
    //check balance token x
    const tokenAccountInfo_x = await getAccount(
      connection,
      tokenAccount_x.address
    )
    console.log("balance x:" , tokenAccountInfo_x.amount)
    
    //Create token y
    const mint_y = await createMint(
      connection,
      wallet,
      wallet.publicKey,
      wallet.publicKey,
      0
    );
    console.log("mintAccount_y:" , mint_y)
   
    //Create token account y
    const tokenAccount_y = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mint_y,
      wallet.publicKey
    )
    console.log("tokenAccount_y:" , tokenAccount_y.address.toBase58())
    
    //Mint token y for user
    await mintTo(
      connection,
      wallet,
      mint_y,
      tokenAccount_y.address,
      wallet,
      new anchor.BN(100)
    )

    //check balance token y
    const tokenAccountInfo_y = await getAccount(
      connection,
      tokenAccount_y.address
    )
    console.log("balance y:" , tokenAccountInfo_y.amount)

    //Create pool Lp
    const [pda_program_pool, bump] = await PublicKey.findProgramAddressSync([Buffer.from("pool"), mint_x.toBuffer(), mint_y.toBuffer()],program.programId);
      await program.rpc.addPool(
        bump,
        {
          accounts: {
            user: wallet.publicKey,
            mintX: mint_x,
            mintY: mint_y,
            poolState : pda_program_pool,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
          },
          signer:[wallet],
          
        });
       console.log("pda_pool:", pda_program_pool);


      //Create token account of pool lp
      //const [pda_program_token_x, bump_x] = await PublicKey.findProgramAddressSync([Buffer.from("swappool"),mint_x.toBuffer()],program.programId)
      //const [pda_program_token_y, bump_y] = await PublicKey.findProgramAddressSync([Buffer.from("swappool"),mint_y.toBuffer()],program.programId)
      
      
      const amount_x = new anchor.BN(50);
      const amount_y = new anchor.BN(50);
      
      const tokenAccount_pdax = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        mint_x,
        pda_program_pool,
        true
      )
      console.log("tokenAccount_pdax" , tokenAccount_pdax.address.toBase58())

      const tokenAccount_pday = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        mint_y,
        pda_program_pool,
        true
      )
      console.log("tokenAccount_pday" , tokenAccount_pday.address.toBase58())
      try {
        await program.rpc.addLiquidity(
          amount_x,
          amount_y,
          //bump_x,
          //bump_y,
          {
          accounts: {
            user: wallet.publicKey,
            mintX: mint_x,
            mintY: mint_y,
            tokenAccountX : tokenAccount_pdax.address.toBase58(),
            poolState: pda_program_pool,
            tokenAccountY : tokenAccount_pday.address.toBase58(),
            tokenUserX : tokenAccount_x.address.toBase58(),
            tokenUserY : tokenAccount_y.address.toBase58(),
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
          },
          signer:[wallet],
        });
      } catch (error) {
        console.error(error)
      }


      //Swap token 
      try {
        const amount_swap = new anchor.BN(10);
        const token_swap = mint_x;
        await program.rpc.swap(
          amount_swap,
          token_swap,
          bump,
          {
          accounts:{
            user: wallet.publicKey,
            mintX: mint_x,
            mintY: mint_y,
            tokenUserX : tokenAccount_x.address.toBase58(),
            tokenUserY : tokenAccount_y.address.toBase58(),
            poolState : pda_program_pool,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenPoolX: tokenAccount_pdax.address.toBase58(),
            tokenPoolY: tokenAccount_pday.address.toBase58(),
          },
          signer:[wallet],

        });
        console.log();
      } catch(error) {
         console.error(error)
      }

    })
});



