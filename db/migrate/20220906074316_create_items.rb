class CreateItems < ActiveRecord::Migration[7.0]
  def change
    create_table :items do |t|
      t.string     :name, limit: 64, null: false
      t.string     :note, limit: 128
      t.string     :category, limit: 64, default: 'expenses'
      t.integer    :amount, null: false
      t.belongs_to :user, foreign_key: true
      t.belongs_to :tag, foreign_key: true
      t.timestamps
    end
  end
end
