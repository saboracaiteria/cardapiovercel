-- Add profile_photo_url column to settings table
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Set default value for existing row
UPDATE settings 
SET profile_photo_url = 'https://raw.githubusercontent.com/saboracaiteria/SABOR-/main/175.jpg'
WHERE id = 1 AND profile_photo_url IS NULL;
