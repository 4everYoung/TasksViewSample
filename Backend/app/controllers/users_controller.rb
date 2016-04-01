class UsersController < ApplicationController

  def index
    users       = User.all
    total_items = users.size

    if (filters = params['filters']).present?
      filters = hash_string_symbols(JSON.parse(filters)) unless filters.is_a?(Hash)
      users   = users.offset(filters[:limit]*(filters[:offset] - 1)).limit(filters[:limit]) if (filters[:limit] > 0 && filters[:offset] > 0)
    end
    render json: { users: ActiveModel::SerializableResource.new(users), total_items: total_items }
  end
end