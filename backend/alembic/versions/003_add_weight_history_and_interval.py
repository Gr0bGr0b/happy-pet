"""add weight_history table and cats.injection_interval_hours

Revision ID: 003
Revises: 002
Create Date: 2026-09-17
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # server_default is what lets the column be NOT NULL on a table that already has
    # rows; 12 h is the interval the app assumed before the column existed.
    op.add_column(
        "cats",
        sa.Column(
            "injection_interval_hours",
            sa.Integer(),
            nullable=False,
            server_default="12",
        ),
    )

    op.create_table(
        "weight_history",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("cat_id", sa.Integer(), nullable=False),
        sa.Column("weight", sa.Float(), nullable=False),
        sa.Column(
            "recorded_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["cat_id"], ["cats.id"], ondelete="CASCADE"),
    )
    op.create_index(
        "idx_weight_history_cat_recorded",
        "weight_history",
        ["cat_id", sa.text("recorded_at DESC")],
    )

    # Backfill one point per existing cat, so the trend chart is not empty on day one.
    op.execute(
        "INSERT INTO weight_history (cat_id, weight, recorded_at) "
        "SELECT id, weight, created_at FROM cats"
    )


def downgrade() -> None:
    op.drop_index("idx_weight_history_cat_recorded", table_name="weight_history")
    op.drop_table("weight_history")
    op.drop_column("cats", "injection_interval_hours")
