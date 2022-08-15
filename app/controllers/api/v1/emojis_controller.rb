class Api::V1::EmojisController < ApplicationController
  def index
    @emojis = File.read("#{Rails.root}/static/emoji_v14.0.json")
    if stale?(@emojis)
      expires_in 3.months
      send_response(JSON.parse(@emojis))
    end
  end
end
