Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  namespace :api do
    namespace :v1 do
      get '/emojis', to: 'emojis#index'
      post '/auth_codes', to: 'auth_codes#create'
      post '/sessions', to: 'sessions#create'
      get '/users', to: 'users#index'
      resources :tags
      resources :items
    end
  end
end
