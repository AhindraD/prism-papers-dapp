use anchor_lang::prelude::*;

use crate::{
    constants::{
        ANCHOR_DISCRIMINATOR, GLOBAL_FEE_PERCENTAGE, PAPER_SEED, RECEIPT_SEED, USER_SEED,
        VAULT_SEED_ADMIN, VAULT_SEED_USER,
    },
    errors::ErrorCodes,
    states::{AccessReceipt, ResearchPaper, User},
};

#[derive(Accounts)]
pub struct PurchaseAccess<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        mut,
        seeds = [PAPER_SEED, research_paper.author.key().as_ref()],
        bump=research_paper.bump
    )]
    pub research_paper: Account<'info, ResearchPaper>,

    #[account(
        mut,
        seeds = [USER_SEED, buyer_user_account.owner.key().as_ref()],
        bump=buyer_user_account.bump
    )]
    pub buyer_user_account: Account<'info, User>,

    #[account(
        mut,
        seeds = [VAULT_SEED_USER, buyer.key().as_ref()],
        bump
    )]
    pub buyer_vault: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [USER_SEED, research_paper.author.key().as_ref()],
        bump=author_user_account.bump
    )]
    pub author_user_account: Account<'info, User>,
    #[account(
        mut,
        seeds = [VAULT_SEED_USER, research_paper.author.key().as_ref()],
        bump
    )]
    pub author_vault: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [VAULT_SEED_ADMIN],
        bump
    )]
    pub admin_vault: SystemAccount<'info>,

    #[account(
        init,
        payer = buyer,
        space = ANCHOR_DISCRIMINATOR + AccessReceipt::INIT_SPACE,
        seeds = [RECEIPT_SEED, buyer.key().as_ref(), research_paper.key().as_ref()],
        bump
    )]
    pub access_receipt: Account<'info, AccessReceipt>,

    pub system_program: Program<'info, System>,
}

impl<'a> PurchaseAccess<'a> {
    pub fn purchase_access(&mut self, bumps: &PurchaseAccessBumps) -> Result<()> {
        require!(
            self.research_paper.price > 0,
            ErrorCodes::ResearchPriceInvalid
        );
        require!(
            self.buyer.key() != self.research_paper.author,
            ErrorCodes::PublisherCantBuySelf
        );
        require!(
            self.buyer.lamports() >= self.research_paper.price,
            ErrorCodes::InsufficientFundsInWallet
        );

        let total_amount = self.research_paper.price;
        let platform_fee = total_amount
            .checked_mul(GLOBAL_FEE_PERCENTAGE / 100)
            .ok_or(ErrorCodes::MathOverflow)?;

        Ok(())
    }
}
