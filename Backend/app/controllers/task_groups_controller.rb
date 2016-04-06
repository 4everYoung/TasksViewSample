class TaskGroupsController < ApplicationController

  def index
    groups = params['group_by'].present? ? TaskGroup.group(:provider_type) : TaskGroup.all

    if (filters = params['filters']).present?
      filters   = hash_string_symbols(JSON.parse(filters)) unless filters.is_a?(Hash)
      groups    = groups.where(provider_type: filters[:provider_type]) if filters[:provider_type].present?
      total_items = groups.size

      groups = groups.offset(filters[:limit]*(filters[:offset] - 1))
                    .limit(filters[:limit]) if (filters[:limit] > 0 && filters[:offset] > 0)
    else
      total_items = groups.size
    end
    render json: { 
      total_items: total_items, 
      groups: ActiveModel::SerializableResource.new(groups) 
    }
  end

  def search_by_type
    task_groups = params[:type].present? ? TaskGroup.where("provider_type LIKE '%#{params[:type]}%'").group(:provider_type) : []
    render json: { 
      total_count:  task_groups.size,
      items:        ActiveModel::SerializableResource.new(task_groups)
    }
  end
end