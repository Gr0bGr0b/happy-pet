"""create cats table

Revision ID: 001
Revises:
Create Date: 2026-07-28
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "cats",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(20), nullable=False),
        sa.Column("date_of_birth", sa.Date(), nullable=False),
        sa.Column("breed", sa.String(30), nullable=False),
        sa.Column("sex", sa.String(6), nullable=False),
        sa.Column("diabetes", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("color", sa.String(20), nullable=False),
        sa.Column("weight", sa.Float(), nullable=False),
        sa.Column("image_url", sa.String(255), nullable=True),
        sa.Column("food_per_ration", sa.Float(), nullable=True),
        sa.Column("food_name", sa.String(50), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_cats_name", "cats", ["name"])
    op.create_index("idx_injection_logs_created_at", "cats", ["created_at"])


def downgrade() -> None:
    op.drop_index("idx_injection_logs_created_at", table_name="cats")
    op.drop_index("idx_cats_name", table_name="cats")
    op.drop_table("cats")
