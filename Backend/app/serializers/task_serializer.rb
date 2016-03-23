class TaskSerializer < ActiveModel::Serializer
  attributes :id, :description, :created_at, :updated_at, :business, :device, :task_group, :assignee

  def business
    business = object.business
    return {
      id:       business.id,
      name:     business.name,
      address:  business.address,
      city:     business.city,
      state:    business.state,
      zip:      business.zip,
      country:  business.country,
      phone:    business.phone
    }
  end

  def device
    device = object.device
    return {
      id:       device.id,
      name:     device.name,
      browser:  device.browser,
      os:       device.os
    }
  end

  def task_group
    task_group  = object.task_group
    assignor    = object.task_group.assignor
    operator    = object.task_group.operator 
    return {
      id:         task_group.id,
      name:       task_group.name,
      provider:   task_group.provider,
      task_type:  task_group.task_type,
      priority:   task_group.priority,
      assignor:   {
        id:     assignor.id,
        email:  assignor.email,
        name:   assignor.full_name     
      },
      operator:   {
        id:     operator.id,
        email:  operator.email,
        name:   operator.full_name     
      }
    }   
  end

  def assignee
    assignee = object.assignee
    return {
      id:     assignee.id,
      email:  assignee.email,
      name:   assignee.full_name
    }
  end
end