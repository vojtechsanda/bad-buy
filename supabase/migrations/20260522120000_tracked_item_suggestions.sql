-- =============================================================================
-- Stores the AI-generated suggestions that were shown to the user during the
-- audit session that produced a given tracked_item. Displayed read-only on the
-- Vault detail screen;
-- =============================================================================

CREATE TABLE IF NOT EXISTS tracked_item_suggestion (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tracked_item_id  uuid        NOT NULL REFERENCES tracked_item(id) ON DELETE CASCADE,
  name             text        NOT NULL,
  item_emoji       text,
  price_usd        decimal     NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tracked_item_suggestion_item
  ON tracked_item_suggestion(tracked_item_id);

ALTER TABLE tracked_item_suggestion ENABLE ROW LEVEL SECURITY;

-- Users may only read suggestions that belong to their own tracked items.
CREATE POLICY "owner can select tracked_item_suggestion"
  ON tracked_item_suggestion
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tracked_item ti
      WHERE ti.id = tracked_item_suggestion.tracked_item_id
        AND ti.account_id = auth.uid()
    )
  );

-- Users may insert suggestions only for their own tracked items.
CREATE POLICY "owner can insert tracked_item_suggestion"
  ON tracked_item_suggestion
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tracked_item ti
      WHERE ti.id = tracked_item_suggestion.tracked_item_id
        AND ti.account_id = auth.uid()
    )
  );
