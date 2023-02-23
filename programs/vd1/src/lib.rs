use anchor_lang::prelude::*;


use anchor_spl::{
    token::{TokenAccount, Mint, Token},
};


use anchor_lang::solana_program::{
    instruction::{
      Instruction,
    },
    program::{
      invoke,
      invoke_signed,
    },
  };
  use spl_token::{
    ID as TOKEN_PROGRAM_ID,
  };

declare_id!("35TKZPztLWEgif2x6RAYKTR5Tkqa7euB19sYSqrC3M6c");

#[derive(AnchorSerialize, AnchorDeserialize, Default)]
pub struct TransferTokenParams {
    pub instruction: u8,
    pub amount: u64,
}

fn transfer_token<'a>(
    amount: u64,
    from: &AccountInfo<'a>,
    to: &AccountInfo<'a>,
    authority: &AccountInfo<'a>,
    signer_seeds:  &[&[&[u8]]]
) -> std::result::Result<(), ProgramError> {
    let data = TransferTokenParams {
        instruction: 3,
        amount,
      };
      let instruction = Instruction {
        program_id : TOKEN_PROGRAM_ID,
        accounts: vec![
            AccountMeta::new(*from.key,false),
            AccountMeta::new(*to.key, false),
            AccountMeta::new(*authority.key, true)
        ],
        data : data.try_to_vec().unwrap(),
      };
      if signer_seeds.len() == 0 {
        invoke(&instruction, &[from.clone(), to.clone(), authority.clone()])
      }
      else {
        invoke_signed(&instruction, &[from.clone(), to.clone(), authority.clone()], &signer_seeds)
      }
}

fn caculation_token(input_amount: u64, balance_x: u64, balance_y: u64,check_token_x: bool) -> u64{
    let x = u128::from(balance_x);
    let y = u128::from(balance_y);
    let d = u128::from(input_amount);
    if check_token_x {
        let receive_token =  y.checked_sub(x.checked_mul(y).unwrap().checked_div(x.checked_add(d).unwrap()).unwrap()).unwrap();
        u64::try_from(receive_token).unwrap()
    } else {
        let receive_token =  x.checked_sub(x.checked_mul(y).unwrap().checked_div(y.checked_add(d).unwrap()).unwrap()).unwrap();
        u64::try_from(receive_token).unwrap()

    }
}

#[program]
pub mod vd1{
    use super::*;


    pub fn add_pool(ctx: Context<AddPoolLP>, _bump: u8) -> Result<()> {
        let state = &mut ctx.accounts.pool_state;
        state.is_actived = true;
        state.mint_x = ctx.accounts.mint_x.key();
        state.mint_y = ctx.accounts.mint_y.key();
        Ok(())
    }

    pub fn add_liquidity(ctx: Context<AddLP>, amount_x: u64, amount_y: u64, _bump_x: u8, _bump_y: u8) -> Result<()> {
        let state = &mut ctx.accounts.pool_state;
        let is_actived = state.is_actived;
        if is_actived  == false {
            return err!(MyError::NeedInitPool);
        } else {
            transfer_token(
                amount_x,
                &ctx.accounts.token_user_x.to_account_info(),
                &ctx.accounts.token_account_x.to_account_info(),
                &ctx.accounts.user.to_account_info(),
                &[],
            ).expect("transfer fail");

            transfer_token(
                amount_y,
                &ctx.accounts.token_user_y.to_account_info(),
                &ctx.accounts.token_account_y.to_account_info(),
                &ctx.accounts.user.to_account_info(),
                &[],
            ).expect("transfer fail");
        }
        Ok(())
    }

    pub fn swap(ctx: Context<SwapToken>, amount: u64, type_token: Pubkey, _bump: u8) -> Result<()> {
        let state = &mut ctx.accounts.pool_state;
        require!(state.is_actived, MyError::NeedInitPool);
        let balance_x = ctx.accounts.token_pool_x.amount;
        let balance_y = ctx.accounts.token_pool_y.amount;
        let mint_x = ctx.accounts.mint_x.key().clone();
        let mint_y = ctx.accounts.mint_y.key().clone();
        let seed : &[&[u8]] = &[
            b"pool".as_ref(), 
            mint_x.as_ref(), 
            mint_y.as_ref(),
            &[_bump]];
        if type_token == mint_x {
            require!(amount <= ctx.accounts.token_user_x.amount, MyError::NotEnough);
            let receive_token = caculation_token(amount, balance_x, balance_y, true);
            transfer_token(
                amount,
                &ctx.accounts.token_user_x.to_account_info(),
                &ctx.accounts.token_pool_x.to_account_info(),
                &ctx.accounts.user.to_account_info(),
                &[],
            ).expect("transfer fail");

            transfer_token(
                receive_token,
                &ctx.accounts.token_pool_y.to_account_info(),
                &ctx.accounts.token_user_y.to_account_info(),
                &ctx.accounts.pool_state.to_account_info(),
                &[&seed],
            ).expect("transfer fail");

        } else {
            require!(amount <= ctx.accounts.token_user_y.amount, MyError::NotEnough);
            let receive_token = caculation_token(amount, balance_x, balance_y, false);
            transfer_token(
                amount,
                &ctx.accounts.token_user_y.to_account_info(),
                &ctx.accounts.token_pool_y.to_account_info(),
                &ctx.accounts.user.to_account_info(),
                &[]
            ).expect("transfer fail");

            transfer_token(
                receive_token,
                &ctx.accounts.token_pool_x.to_account_info(),
                &ctx.accounts.token_user_x.to_account_info(),
                &ctx.accounts.pool_state.to_account_info(),
                &[&seed],
            ).expect("transfer fail");
        }
        Ok(())
    }
}

   
    #[account]
    #[derive( Default)]
    pub struct InitPool{
        pub mint_x:  Pubkey,
        pub mint_y:  Pubkey,
        pub is_actived: bool,
    }

    #[derive(Accounts)]
    pub struct AddPoolLP<'info> {
        #[account(mut)]
        user: Signer<'info>,
        #[account(mut)]
        mint_x : Account<'info, Mint>,
        #[account(mut)]
        mint_y: Account<'info, Mint>,
        #[account(
            init,
            payer = user,
            seeds=[b"pool".as_ref(), mint_x.key().as_ref(), mint_y.key().as_ref()],
            bump,
            space = 32 + 32 + 1+ 8,
        )]
        pool_state: Account<'info, InitPool>,
        system_program: Program<'info, System>,
        token_program: Program<'info, Token>,
    }

    #[derive(Accounts)]
    pub struct AddLP<'info> {
        #[account(mut)]
        user: Signer<'info>,
        #[account(mut)]
        mint_x : Box<Account<'info, Mint>>,
        #[account(mut)]
        mint_y: Box<Account<'info, Mint>>,
        #[account(
            init,
            payer = user,
            seeds=[b"swappool".as_ref(), mint_x.key().as_ref()],
            bump,
            token::mint = mint_x,
            token::authority = pool_state,
        )]
        token_account_x: Box<Account<'info, TokenAccount>>,
        #[account(mut)]
        pool_state: Box<Account<'info, InitPool>>,
    
        #[account(
            init,
            payer = user,
            seeds=[b"swappool".as_ref(), mint_y.key().as_ref()],
            bump ,
            token::mint = mint_y,
            token::authority = pool_state,
        )]
        token_account_y: Box<Account<'info, TokenAccount>>,
        #[account(
            mut,
            constraint=token_user_x.owner == user.key(),
            constraint=token_user_x.mint == mint_x.key(),
        )]
        token_user_x: Box<Account<'info, TokenAccount>>,
        #[account(
            mut,
            constraint=token_user_y.owner == user.key(),
            constraint=token_user_y.mint == mint_y.key(),
        )]
        token_user_y: Box<Account<'info, TokenAccount>>,
        system_program: Program<'info, System>,
        token_program: Program<'info, Token>,

    }
    #[derive(Accounts)]
    pub struct SwapToken<'info>{
        #[account(mut)]
        user: Signer<'info>,
        #[account(mut)]
        mint_x: Box<Account<'info, Mint>>,
        #[account(mut)]
        mint_y: Box<Account<'info, Mint>>,

        #[account(
            mut,
            constraint=token_user_x.owner == user.key(),
            constraint=token_user_x.mint == mint_x.key(),
        )]
        token_user_x: Box<Account<'info, TokenAccount>>,
        #[account(
            mut,
            constraint=token_user_y.owner == user.key(),
            constraint=token_user_y.mint == mint_y.key(),
        )]
        token_user_y: Box<Account<'info, TokenAccount>>,
        #[account(mut)]
        pool_state: Box<Account<'info, InitPool>>,
        system_program: Program<'info, System>,
        token_program: Program<'info, Token>,

        #[account(
            mut,
            constraint=token_pool_x.owner==pool_state.key(),
            constraint=token_pool_x.mint==mint_x.key()
        )]
        token_pool_x: Box<Account<'info, TokenAccount>>,

        #[account(
            mut,
            constraint=token_pool_y.owner==pool_state.key(),
            constraint=token_pool_y.mint==mint_y.key()
        )]
        token_pool_y: Box<Account<'info, TokenAccount>>,
    }
    #[derive(Accounts)]
    pub struct NeedInitPool {}

    #[derive(Accounts)]
    pub struct NotEnough {}
    

    #[error_code]
    pub enum MyError {
        #[msg("Pool haven't created yet")]
        NeedInitPool,
        #[msg("Not enough balance")]
        NotEnough
    }








