class UsersController < ApplicationController

  def index
    users       = User.all
    total_items = users.size

    if (filters = params['filters']).present?
      filters = hash_string_symbols(JSON.parse(filters)) unless filters.is_a?(Hash)
      users   = users.offset(filters[:limit]*(filters[:offset] - 1)).limit(filters[:limit]) if (filters[:limit] > 0 && filters[:offset] > 0)
    end
    render json: { 
      total_items: total_items, 
      users: ActiveModel::SerializableResource.new(users) 
    }
  end

  def search_by_name
    users = params[:name].present? ? User.where("full_name LIKE '%#{params[:name]}%'") : []
    render json: { 
      total_count:  users.size,
      items:        ActiveModel::SerializableResource.new(users)
    }
  end
end