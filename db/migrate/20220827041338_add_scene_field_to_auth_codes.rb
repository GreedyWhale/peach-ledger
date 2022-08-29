class AddSceneFieldToAuthCodes < ActiveRecord::Migration[7.0]
  def change
    change_table :auth_codes do |t|
      t.column :scene, :string, limit: 64, default: :signIn
    end
  end
end
