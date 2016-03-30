class TaskSerializer < ActiveModel::Serializer
  attributes :id, :description, :created_at, :updated_at, :business, :device, :task_group, :assignee

  def business
    business = object.business
    business.present? ? {
      id:       business.id,
      name:     business.name,
      address:  business.address,
      city:     business.city,
      state:    business.state,
      zip:      business.zip,
      country:  business.country,
      phone:    business.phone
    } : {}
  end

  def device
    device = object.device
    device.present? ? {
      id:       device.id,
      name:     device.name,
      browser:  device.browser,
      os:       device.os
    } : {}
  end

  def task_group
    task_group  = object.task_group
    if task_group.present? 
      result = {
        id:         task_group.id,
        name:       task_group.name,
        provider:   task_group.provider,
        task_type:  task_group.task_type,
        priority:   task_group.priority
      }
      assignor    = object.task_group.assignor
      operator    = object.task_group.operator
      result.merge!({assignor: {
        id:     assignor.id,
        email:  assignor.email,
        name:   assignor.full_name     
      }}) if assignor.present?
      result.merge!({operator: {
        id:     operator.id,
        email:  operator.email,
        name:   operator.full_name        
      }}) if operator.present?
      result
    else
      {}
    end
  end

  def assignee
    assignee = object.assignee
    if assignee.present? 
      {
      id:     assignee.id,
      email:  assignee.email,
      name:   assignee.full_name
      } 
    else
      {}
    end
  end
end