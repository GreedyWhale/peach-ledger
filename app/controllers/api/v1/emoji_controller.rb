class Api::V1::EmojiController < ApplicationController
  def index
    @emoji = File.read("#{Rails.root}/static/emoji_v14.0.json")
    if stale?(@emoji)
      expires_in 3.months
      send_response(JSON.parse(@emoji))
    end
  end
end
