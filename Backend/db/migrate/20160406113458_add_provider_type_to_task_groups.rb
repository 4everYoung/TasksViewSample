class AddProviderTypeToTaskGroups < ActiveRecord::Migration
  def change
    add_column :task_groups, :provider_type, :string
  end
end
