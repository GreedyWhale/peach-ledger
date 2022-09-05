class Tag < ApplicationRecord
  belongs_to :user

  validates :user_id, presence: { message: '用户不存在' }
  validates :name, format: { with: /\S{1,64}/, message: '标签名格式错误' }
  validates :type, acceptance: { accept: ['expenses', 'income'] }
  validates :emoji, presence: { message: '标签图标不能为空' }
end
