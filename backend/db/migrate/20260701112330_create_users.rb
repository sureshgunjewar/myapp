class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.integer :age
      t.boolean :active
      t.boolean :deleted
      t.string :role
      t.string :city

      t.timestamps
    end
  end
end
