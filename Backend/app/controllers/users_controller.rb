class UsersController < ApplicationController

  def index
    users = User.all
    total_items = users.count

    if (filters = params['filters']).present?
      filters = JSON.parse(filters) unless filters.is_a?(Hash)
      limit   = filters['limit'].to_i
      offset  = filters['offset'].to_i
      users   = users.offset(limit*(offset - 1)).limit(limit) if (limit > 0 && offset > 0)
    end

    users = users.map { |t| { full_name: t.full_name, email: t.email, id: t.id } }
    render json: { users: users, total_items: total_items }
  end
end