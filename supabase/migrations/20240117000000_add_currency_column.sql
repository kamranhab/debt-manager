-- Add currency enum type
CREATE TYPE debt_currency AS ENUM ('USD', 'INR');

-- Add currency column to debts table with USD as default
ALTER TABLE debts
ADD COLUMN currency debt_currency NOT NULL DEFAULT 'INR';