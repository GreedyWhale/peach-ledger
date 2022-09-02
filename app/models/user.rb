require 'jwt'

class User < ApplicationRecord
  def generate_jwt
    payload = { user_id: self.id, exp: (Time.now + 7.days).to_i }
    JWT.encode(payload, Rails.application.credentials[:secret_key_base], 'HS256')
  end
end
