class CreateTags < ActiveRecord::Migration[7.0]
  def change
    create_table :tags do |t|
      t.string     :name, limit: 64
      t.string     :emoji, array: true
      t.string     :type, limit: 64, default: 'expenses'
      t.boolean    :destroyed, default: false
      t.timestamps
    end
  end
end
