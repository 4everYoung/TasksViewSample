class CreateMainTables < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.string 	:description
      t.integer :assignee_id
      t.integer :device_id
      t.integer :business_id
      t.integer :task_group_id
      t.timestamps
    end

    create_table :devices do |t|
      t.string 	:browser
      t.string  :name
      t.string  :os
      t.timestamps
    end

    create_table :task_groups do |t|
      t.string 	 :name
      t.string   :provider
      t.string   :task_type
      t.integer  :priority
      t.integer  :assignor_id
    end

    create_table :businesses do |t|
      t.string 	 :name
      t.string   :address
      t.string   :city
      t.string   :state
      t.string   :zip
      t.string   :country
      t.string   :phone  
    end
  end
end
