class CreateOrders < ActiveRecord::Migration[8.1]
  def change
    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true
      t.string :product_name
      t.decimal :amount
      t.string :status
      t.string :payment_status

      t.timestamps
    end
  end
end
