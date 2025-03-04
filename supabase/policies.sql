-- Enable Row Level Security
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

-- Policy for selecting debts (read)
CREATE POLICY "Users can view their own debts"
ON debts
FOR SELECT
USING (auth.uid() = user_id);

-- Policy for inserting debts
CREATE POLICY "Users can create their own debts"
ON debts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for updating debts
CREATE POLICY "Users can update their own debts"
ON debts
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy for deleting debts
CREATE POLICY "Users can delete their own debts"
ON debts
FOR DELETE
USING (auth.uid() = user_id);