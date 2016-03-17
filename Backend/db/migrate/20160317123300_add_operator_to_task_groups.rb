class AddOperatorToTaskGroups < ActiveRecord::Migration
  def change
  	add_column :task_groups, :operator_id, :integer
  end
end
