Rails.application.routes.draw do
  devise_for :users

  scope '/api' do
    resources :tasks, only: [:index, :show] do
      collection do
        get   'task_types'
        post  'export'
        get   'check_perform/:jid' => 'tasks#check_perform'
      end
    end
  end
  
  root to: "home#index"
end