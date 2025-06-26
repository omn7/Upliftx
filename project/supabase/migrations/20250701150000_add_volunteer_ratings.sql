-- Add volunteer ratings and image support
-- This migration adds rating and image fields to applications table

-- Add rating and image columns to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5),
ADD COLUMN IF NOT EXISTS volunteer_image_url TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add index for better performance on rating queries
CREATE INDEX IF NOT EXISTS idx_applications_rating ON applications(rating);

-- Add index for volunteer_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_applications_volunteer_id ON applications(volunteer_id);

-- Add index for status for faster filtering
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status); 