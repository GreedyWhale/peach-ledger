class CreateAuthCodes < ActiveRecord::Migration[7.0]
  def change
    create_table :auth_codes do |t|

      t.string     :email, null: false
      t.string     :code, limit: 16
      t.timestamps
    end
  end
end
