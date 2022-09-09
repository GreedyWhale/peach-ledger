require 'acceptance_helper'

resource "Tags" do
  # 接口描述
  explanation "标签的增、删、改、查"

  # 添加token到请求头
  authentication :basic, :auth
  let(:user) { User.create_or_find_by(email: '383911973@qq.com') }
  let(:auth) { "Bearer #{user.generate_jwt}" }

  # 返回字段描述
  with_options :scope => :data do
    response_field :id, 'id'
    response_field :user_id, '用户id'
    response_field :name, '标签名'
    response_field :category, '标签类型，可能的值有："expenses"、"income"'
    response_field :deleted, "是否删除"
    response_field :emoji, "标签符号"
    response_field :created_at, "创建时间"
    response_field :deleted_at, "删除时间"
    response_field :updated_at, "更新时间时间"
  end

  get '/api/v1/tags/:id' do
    parameter :id, "标签id", required: true, type: :number
    let(:tag) {
      Tag.create_or_find_by(
        name: '接口测试',
        emoji: ['1F359'],
        category: 'expenses',
        user_id: user.id,
        deleted: false,
      )
    }
    let(:id) { tag.id }

    example "获取单个标签信息" do
      do_request
      expect(JSON.parse(response_body)['data']['id']).to eq(tag.id)
    end
  end

  get '/api/v1/tags' do
    parameter :category, '标签类型，可能的值有："expenses"、"income"', required: true, type: :string
    let(:category) {'expenses'}

    example "获取标签列表" do
      10.times do |t|
        Tag.create(
          name: "接口测试#{t}",
          emoji: ['1F359'],
          category: 'expenses',
          user_id: user.id,
          deleted: false,
        )
      end

      do_request
      json = JSON.parse(response_body)
      expect(status).to eq(200)
      expect(json['data'].size).to eq(10)
    end
  end

  post '/api/v1/tags' do
    parameter :category, '标签类型，可能的值有："expenses"、"income"', required: true, type: :string
    parameter :name, '标签名', required: true, type: :string
    parameter :emoji, '标签符号', required: true, type: :array, items: {type: :string}

    let (:category) { 'expenses' }
    let (:name) { '测试标签' }
    let (:emoji) { ['1F38C'] }

    example "创建标签" do
      Tag.create(
        name: name,
        emoji: emoji,
        category: category,
        user_id: user.id,
        deleted: false,
      )

      do_request
      json = JSON.parse(response_body)
      expect(status).to eq(200)
      expect(json['data']['name']).to eq(name)
      expect(json['data']['category']).to eq(category)
      expect(json['data']['emoji']).to match_array(emoji)
    end
  end

  patch '/api/v1/tags/:id' do
    parameter :id, '标签id', required: true, type: :number
    parameter :name, '标签名', type: :string
    parameter :emoji, '标签符号', type: :array

    let (:tag) {
      Tag.create(
        name: '测试标签',
        emoji: ['1F38C'],
        category: 'expenses',
        user_id: user.id,
        deleted: false,
      )
    }
    let (:id) { tag.id }
    let (:name) { '更新标签' }
    let (:emoji) { ["1F3F3", "FE0F", "200D", "1F308"] }

    example "更新标签" do
      do_request
      json = JSON.parse(response_body)
      expect(status).to eq(200)
      expect(json['data']['name']).to eq(name)
      expect(json['data']['emoji']).to match_array(emoji)
    end
  end

  delete '/api/v1/tags/:id' do
    let (:tag) {
      Tag.create(
        name: '测试标签',
        emoji: ['1F38C'],
        category: 'expenses',
        user_id: user.id,
        deleted: false,
      )
    }
    let (:id) { tag.id }

    example "删除标签" do
      do_request
      json = JSON.parse(response_body)
      expect(status).to eq(200)
      expect(json['data']['deleted']).to eq(true)
    end
  end
end
