use anchor_lang::prelude::*;

#[constant]
pub const ANCHOR_DISCRIMINATOR: usize = 8;

pub const ADMIN_PUBKEYS: [Pubkey; 2] = [
    pubkey!("MNG3SoboXMyjse4ggiyBWJreNhfxyni5VJFxSLmXM5n"),
    pubkey!("AHibwaXG2EVnD1jTvD93166tunfNecvMcVQhcQKL3UZv"),
];
// Logic: fee_amount = (price * GLOBAL_FEE_PERCENTAGE) / 100
pub const GLOBAL_FEE_PERCENTAGE: u8 = 5; // a 5% platform fee on all transactions, to be collected by the platform

pub const PAPER_INIT_STAT: u32 = 0; //initial sale, review, and purchase etc of a paper
pub const USER_INIT_STAT: u16 = 0; //initial sale, review, and purchase etc of a paper

pub const USER_SEED: &[u8] = b"user";
pub const PAPER_SEED: &[u8] = b"paper";
pub const REVIEW_SEED: &[u8] = b"review";
pub const RECEIPT_SEED: &[u8] = b"receipt";
pub const VAULT_SEED_USER: &[u8] = b"vault_user";
pub const VAULT_SEED_ADMIN: &[u8] = b"vault_admin";
