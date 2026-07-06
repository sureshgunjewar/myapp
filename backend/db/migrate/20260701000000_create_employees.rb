class CreateEmployees < ActiveRecord::Migration[8.1]
  def change
    create_table :employees do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :department, null: false
      t.string :position, null: false

      t.timestamps
    end

    add_index :employees, :email, unique: true
  end
end
