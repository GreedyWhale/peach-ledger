class AddDateColumnToItems < ActiveRecord::Migration[7.0]
  def change
    add_column :items, :date, :datetime
  end
end
