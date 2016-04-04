Rails.application.routes.draw do
  devise_for :users

  scope '/api' do
    resources :tasks, only: [:index, :show] do
      collection do
        get   'task_types'
        get   'check_perform/:jid' => 'tasks#check_perform'
        post  'create' => 'tasks#add_task'
        post  'export'
        post  'remove_collection'
        post  'unassign'   
        post  'assign'  
      end
    end

    resources :devices,     only: [:index]
    resources :users,       only: [:index]
    resources :businesses,  only: [:index] do
      collection do
        get 'search_by_name/:name' => 'businesses#search_by_name'
      end   
    end
  end
  
  root to: "home#index"
end