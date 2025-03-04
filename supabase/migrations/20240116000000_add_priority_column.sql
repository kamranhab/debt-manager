-- Add priority enum type
CREATE TYPE debt_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- Add priority column to debts table
ALTER TABLE debts
ADD COLUMN priority debt_priority NOT NULL DEFAULT 'LOW';