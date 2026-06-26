
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS font_family text NOT NULL DEFAULT 'space-grotesk',
  ADD COLUMN IF NOT EXISTS layout_style text NOT NULL DEFAULT 'classic',
  ADD COLUMN IF NOT EXISTS card_opacity numeric NOT NULL DEFAULT 0.55,
  ADD COLUMN IF NOT EXISTS card_blur integer NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS border_glow boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS cursor_trail boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS tilt_cards boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS click_effect_style text NOT NULL DEFAULT 'burst',
  ADD COLUMN IF NOT EXISTS background_image_url text,
  ADD COLUMN IF NOT EXISTS background_opacity numeric NOT NULL DEFAULT 0.4,
  ADD COLUMN IF NOT EXISTS entry_animation text NOT NULL DEFAULT 'fade-up',
  ADD COLUMN IF NOT EXISTS avatar_shape text NOT NULL DEFAULT 'circle',
  ADD COLUMN IF NOT EXISTS animation_speed numeric NOT NULL DEFAULT 1.0,
  ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;
