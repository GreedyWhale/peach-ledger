class Item < ApplicationRecord
  has_one :user
  has_one :tag

  validates :name, presence: true
  validates :tag_id, presence: true
  validates :user_id, presence: true
  validates :amount, presence: true
  validates :category, acceptance: { accept: ['expenses', 'income'] }

  validate :check_tag_belong_to_user

  def check_tag_belong_to_user
    tag = Tag.find_by(user_id: self.user_id, id: self.tag_id)

    unless tag
      self.errors.add(:tag_id, '该标签不属于当前用户')
    end
  end

  def tags
    Tag.find(self.tag_id)
  end
end
