use anchor_lang::prelude::*;

mod constants;
mod errors;
mod instructions;
use instructions::*;
mod states;
declare_id!("JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H");

#[program]
pub mod prismpapersdapp {
    use super::*;

    pub fn init_user(ctx: Context<InitUser>, name: String) -> Result<()> {
        let bumps = ctx.bumps;
        ctx.accounts.initiate_user(name, &bumps)
    }

    pub fn init_research(
        ctx: Context<InitResearch>,
        title: String,
        description: String,
        price: u64,
        encrypted_url: String,
        encryption_key: String,
    ) -> Result<()> {
        let bumps = ctx.bumps;
        ctx.accounts.initiate_research(
            title,
            description,
            price,
            encrypted_url,
            encryption_key,
            &bumps,
        )
    }

    pub fn purchase_access(ctx: Context<PurchaseAccess>) -> Result<()> {
        let bumps = ctx.bumps;
        ctx.accounts.purchase_access(&bumps)
    }
}
