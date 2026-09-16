"""create injection_logs table

Revision ID: 002
Revises: 001
Create Date: 2026-09-16
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Migration 001 created the cats(created_at) index under the injection_logs
    # name. Index names are unique per schema, so free the name before reusing it.
    op.execute("ALTER INDEX IF EXISTS idx_injection_logs_created_at RENAME TO idx_cats_created_at")

    op.create_table(
        "injection_logs",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("cat_id", sa.Integer(), nullable=False),
        sa.Column("dosage", sa.Float(), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["cat_id"], ["cats.id"], ondelete="CASCADE"),
    )
    op.create_index("idx_injection_logs_cat_id", "injection_logs", ["cat_id"])
    op.create_index(
        "idx_injection_logs_created_at", "injection_logs", [sa.text("created_at DESC")]
    )


def downgrade() -> None:
    op.drop_index("idx_injection_logs_created_at", table_name="injection_logs")
    op.drop_index("idx_injection_logs_cat_id", table_name="injection_logs")
    op.drop_table("injection_logs")

    op.execute("ALTER INDEX IF EXISTS idx_cats_created_at RENAME TO idx_injection_logs_created_at")
