class AddUserdFieldToAuthCode < ActiveRecord::Migration[7.0]
  def change
    change_table :auth_codes do |t|
      t.column :used, :boolean, default: false
    end
  end
end
