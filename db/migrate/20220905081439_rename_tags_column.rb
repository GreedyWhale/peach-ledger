class RenameTagsColumn < ActiveRecord::Migration[7.0]
  def change
    rename_column :tags, :type, :category
    rename_column :tags, :destroyed, :deleted
  end
end
