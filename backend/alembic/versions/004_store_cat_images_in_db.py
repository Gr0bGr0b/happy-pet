"""store cat photos in the database

Revision ID: 004
Revises: 003
Create Date: 2026-09-17
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # No backfill: photos previously lived on a Docker volume that a migration cannot
    # reach. cats.image_url is left alone — it still holds the URL, and may hold an
    # external one.
    op.create_table(
        "cat_images",
        sa.Column("cat_id", sa.Integer(), nullable=False),
        sa.Column("content_type", sa.String(32), nullable=False),
        sa.Column("data", sa.LargeBinary(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("cat_id"),
        sa.ForeignKeyConstraint(["cat_id"], ["cats.id"], ondelete="CASCADE"),
    )


def downgrade() -> None:
    op.drop_table("cat_images")
