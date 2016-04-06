Rails.application.routes.draw do
  devise_for :users

  scope '/api' do
    resources :tasks, only: [:index, :show] do
      collection do
        get   'check_perform/:jid'  => 'tasks#check_perform'
        post  'create'              => 'tasks#add_task'
        post  'export'
        post  'remove_collection'
        post  'unassign'   
        post  'assign'  
      end
    end

    resources :task_groups, only: [:index] do
      collection do
        get 'search_by_type/:type' => 'task_groups#search_by_type'
      end  
    end 
    resources :devices,     only: [:index] do
      collection do
        get 'search_by_name/:name' => 'devices#search_by_name'
      end  
    end 
    resources :users,       only: [:index] do
      collection do
        get 'search_by_name/:name' => 'users#search_by_name'
      end  
    end   
    resources :businesses,  only: [:index] do
      collection do
        get 'search_by_name/:name' => 'businesses#search_by_name'
      end   
    end
  end
  
  root to: "home#index"
end