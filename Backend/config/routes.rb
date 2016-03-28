Rails.application.routes.draw do
  devise_for :users

  scope '/api' do
    resources :tasks, only: [:index, :show] do
      collection do
        get   'task_types'
        get   'users'
        get   'check_perform/:jid' => 'tasks#check_perform'
        post  'create' => 'tasks#add_task'
        post  'export'
        post  'remove_collection'
        post  'unassign'   
        post  'assign'  
      end
    end

    resources :users, only: [:index] 
  end
  
  root to: "home#index"
end